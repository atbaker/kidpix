#!/usr/bin/env node

/**
 * Generate embeddings for all stamp labels using Transformers.js
 *
 * This script:
 * 1. Loads sprite labels from sprite-labels.json
 * 2. Generates embeddings using all-MiniLM-L6-v2 model
 * 3. Outputs js/data/stamp-embeddings.json with labels and embeddings
 */

const fs = require('fs');
const path = require('path');

async function generateEmbeddings() {
    console.log('Loading Transformers.js...');
    const { pipeline } = await import('@huggingface/transformers');

    console.log('Loading sprite labels...');
    const labelsPath = path.join(__dirname, 'sprite-labels.json');
    const labelsData = JSON.parse(fs.readFileSync(labelsPath, 'utf8'));

    // Flatten labels while preserving position information
    const stamps = [];

    for (const [sheetNum, sheetData] of Object.entries(labelsData)) {
        for (const [rowNum, rowLabels] of Object.entries(sheetData)) {
            rowLabels.forEach((label, colNum) => {
                stamps.push({
                    label: label,
                    sheet: parseInt(sheetNum),
                    row: parseInt(rowNum),
                    col: colNum
                });
            });
        }
    }

    console.log(`Found ${stamps.length} stamps to embed`);

    // Extract just the labels for embedding
    const labels = stamps.map(s => s.label);

    console.log('Initializing embedding model (all-MiniLM-L6-v2)...');
    console.log('This may take a minute on first run as the model downloads...');
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    console.log('Generating embeddings...');
    const output = await embedder(labels, { pooling: 'mean', normalize: true });

    // Convert embeddings to plain arrays
    const embeddings = [];
    for (let i = 0; i < output.data.length; i += output.dims[1]) {
        embeddings.push(Array.from(output.data.slice(i, i + output.dims[1])));
    }

    console.log(`Generated ${embeddings.length} embeddings of dimension ${output.dims[1]}`);

    // Combine stamps with their embeddings
    const stampEmbeddings = stamps.map((stamp, i) => ({
        label: stamp.label,
        sheet: stamp.sheet,
        row: stamp.row,
        col: stamp.col,
        embedding: embeddings[i]
    }));

    // Save to output file (in data/ directory, not js/data/ to avoid build processing)
    const outputPath = path.join(__dirname, '../data/stamp-embeddings.json');
    const outputData = {
        model: 'Xenova/all-MiniLM-L6-v2',
        dimension: output.dims[1],
        count: stampEmbeddings.length,
        stamps: stampEmbeddings
    };

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

    console.log(`✓ Successfully wrote embeddings to ${outputPath}`);
    console.log(`  File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
}

// Run the script
generateEmbeddings().catch(err => {
    console.error('Error generating embeddings:', err);
    process.exit(1);
});
