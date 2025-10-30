KiddoPaint.Submenu.sprites = [];

KiddoPaint.Sprite.sheets = [
    'img/kidpix-spritesheet-0.png',
    'img/kidpix-spritesheet-0b.png',
    'img/kidpix-spritesheet-1.png',
    'img/kidpix-spritesheet-2.png',
    'img/kidpix-spritesheet-3.png',
    'img/kidpix-spritesheet-4.png',
    'img/kidpix-spritesheet-5.png',
    'img/kidpix-spritesheet-6.png',
    'img/kidpix-spritesheet-7.png',
    'img/kidpix-spritesheet-8.png',
];

// Current search query
KiddoPaint.Sprite.searchQuery = '';

// Debounce timer for search input
KiddoPaint.Sprite.searchDebounceTimer = null;


async function init_sprites_submenu() {
    // Initialize search if not already done
    if (!KiddoPaint.StampSearch.isReady && !KiddoPaint.StampSearch.isLoading) {
        KiddoPaint.StampSearch.init();
    }

    KiddoPaint.Submenu.sprites = [];

    // Add search input as first item (invisible button with custom rendering)
    KiddoPaint.Submenu.sprites.push({
        name: 'Search stamps',
        invisible: true,
        isSearchInput: true,
        handler: function(e) {
            // Prevent default button behavior (event may be undefined from invokeDefaultSubtool)
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });

    // Get search results (or all stamps if no query)
    let stamps = [];
    if (KiddoPaint.StampSearch.isReady) {
        stamps = await KiddoPaint.StampSearch.search(KiddoPaint.Sprite.searchQuery, 14);
    } else {
        // Show first 14 stamps while search initializes
        stamps = KiddoPaint.Sprite.labels ?
            Object.values(KiddoPaint.Sprite.labels)[0][0].slice(0, 14).map((label, i) => ({
                label: label,
                sheet: 0,
                row: 0,
                col: i
            })) : [];
    }

    // Add stamp buttons
    stamps.forEach(stamp => {
        let sheet = KiddoPaint.Sprite.sheets[stamp.sheet];

        let individualSprite = {
            name: stamp.label,
            spriteSheet: sheet,
            spriteRow: stamp.row,
            spriteCol: stamp.col,
            handler: function(e) {
                var img = new Image();
                img.src = sheet;
                img.crossOrigin = 'anonymous';
                img.onload = function() {
                    KiddoPaint.Tools.SpritePlacer.image = scaleImageDataCanvasAPIPixelated(
                        extractSprite(img, 32, stamp.col, stamp.row, 0),
                        2
                    );
                    KiddoPaint.Tools.SpritePlacer.soundBefore = function() {
                        KiddoPaint.Sounds.stamp();
                    };
                    KiddoPaint.Tools.SpritePlacer.soundDuring = function() {};
                    KiddoPaint.Current.tool = KiddoPaint.Tools.SpritePlacer;
                };
            }
        };

        KiddoPaint.Submenu.sprites.push(individualSprite);
    });

    // If no results, show a message
    if (stamps.length === 0 && KiddoPaint.Sprite.searchQuery) {
        KiddoPaint.Submenu.sprites.push({
            name: 'No stamps found',
            text: 'No results',
            handler: function(e) {
                if (e) {
                    e.preventDefault();
                }
            }
        });
    }
}