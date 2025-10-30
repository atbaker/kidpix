/**
 * Hybrid Text + Semantic Search for Stamps
 *
 * Combines fast text matching (Fuse.js) with semantic search (Transformers.js)
 * to provide intelligent stamp filtering.
 *
 * Search behavior:
 * 1. Text matches (exact + fuzzy) are shown first
 * 2. Semantic matches fill remaining slots (up to 10 total)
 * 3. Duplicates are removed
 */

KiddoPaint.StampSearch = {
    embeddings: null,
    fuseInstance: null,
    embedder: null,
    isLoading: false,
    isReady: false,

    /**
     * Initialize the search system
     * Loads embeddings and sets up text search
     */
    init: async function() {
        if (this.isLoading || this.isReady) return;
        this.isLoading = true;

        try {
            console.log('[StampSearch] Loading embeddings...');

            // Load pre-generated embeddings
            const response = await fetch('data/stamp-embeddings.json');
            this.embeddings = await response.json();

            console.log(`[StampSearch] Loaded ${this.embeddings.count} stamp embeddings`);

            // Initialize Fuse.js for text search
            // Using CDN version with dynamic import
            let FuseClass;
            if (typeof Fuse === 'undefined') {
                const FuseModule = await import('https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs');
                FuseClass = FuseModule.default;
            } else {
                FuseClass = Fuse;
            }

            this.fuseInstance = new FuseClass(this.embeddings.stamps, {
                keys: ['label'],
                threshold: 0.4,
                includeScore: true
            });

            this.isReady = true;
            this.isLoading = false;
            console.log('[StampSearch] Text search ready');

            // Eagerly load semantic search model in background (don't await)
            // This starts downloading the model so it's ready when user searches
            this.initSemanticSearch();

        } catch (error) {
            console.error('[StampSearch] Failed to initialize:', error);
            this.isLoading = false;
        }
    },

    /**
     * Load semantic search model (called eagerly during init)
     */
    initSemanticSearch: async function() {
        if (this.embedder) return;

        try {
            console.log('[StampSearch] Loading semantic search model...');

            // Use dynamic import for ES module
            const {
                pipeline
            } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6');
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

            console.log('[StampSearch] Semantic search ready');
        } catch (error) {
            console.error('[StampSearch] Failed to load semantic model:', error);
        }
    },

    /**
     * Perform hybrid search
     * @param {string} query - Search query
     * @param {number} maxResults - Maximum results to return (default 10)
     * @returns {Array} Array of stamp objects with positions
     */
    search: async function(query, maxResults = 10) {
        if (!this.isReady) {
            await this.init();
        }

        query = query.trim().toLowerCase();

        if (!query) {
            // Return all stamps if query is empty
            return this.embeddings.stamps.slice(0, maxResults);
        }

        // Phase 1: Text search (fast, synchronous)
        const textResults = this.fuseInstance.search(query, {
            limit: maxResults
        }).map(result => ({
            ...result.item,
            score: 1 - result.score, // Convert distance to similarity
            source: 'text'
        }));

        // If we have enough text results, return them
        if (textResults.length >= maxResults) {
            return textResults.slice(0, maxResults);
        }

        // Phase 2: Semantic search (slower, fills remaining slots)
        try {
            await this.initSemanticSearch();

            if (this.embedder) {
                const queryEmbedding = await this.embedder(query, {
                    pooling: 'mean',
                    normalize: true
                });

                // Calculate cosine similarity with all stamps
                const semanticResults = this.embeddings.stamps.map(stamp => {
                    const similarity = this.cosineSimilarity(
                        Array.from(queryEmbedding.data),
                        stamp.embedding
                    );
                    return {
                        ...stamp,
                        score: similarity,
                        source: 'semantic'
                    };
                });

                // Sort by similarity
                semanticResults.sort((a, b) => b.score - a.score);

                // Remove stamps already in text results
                const textLabels = new Set(textResults.map(r => r.label));
                const uniqueSemanticResults = semanticResults.filter(
                    r => !textLabels.has(r.label)
                );

                // Combine: text results first, then semantic results
                const combined = [
                    ...textResults,
                    ...uniqueSemanticResults.slice(0, maxResults - textResults.length)
                ];

                return combined.slice(0, maxResults);
            }
        } catch (error) {
            console.warn('[StampSearch] Semantic search failed, using text only:', error);
        }

        // Fallback: return text results only
        return textResults;
    },

    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity: function(a, b) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
};