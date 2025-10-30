KiddoPaint.Submenu = {};

function show_generic_submenu(subtoolbar) {
    if (!KiddoPaint.Submenu[subtoolbar]) {
        return;
    }

    reset_ranges();

    var subtoolbars = document.getElementById('subtoolbars').children;
    var genericsubmenu = null;
    for (var i = 0, len = subtoolbars.length; i < len; i++) {
        var div = subtoolbars[i];
        if (div.id === 'genericsubmenu') {
            div.className = 'subtoolbar'
            genericsubmenu = div;
        } else {
            div.className = 'hidden'
        }
    }

    // clear old ; todo cache constructed buttons instead
    genericsubmenu.removeAllChildren();
    for (var i = 0, len = KiddoPaint.Submenu[subtoolbar].length; i < len; i++) {
        var buttonDetail = KiddoPaint.Submenu[subtoolbar][i];

        // Special handling for search input
        if (buttonDetail.isSearchInput) {
            var searchContainer = document.createElement('div');
            searchContainer.className = 'stamp-search-container';
            searchContainer.style.cssText = 'width: 100%; padding: 5px; box-sizing: border-box;';

            var searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.id = 'stamp-search-input';
            searchInput.placeholder = 'Search stamps...';
            searchInput.className = 'stamp-search-input';
            searchInput.style.cssText = 'width: 100%; padding: 8px; font-size: 14px; border: 2px solid #000; box-sizing: border-box;';
            searchInput.value = KiddoPaint.Sprite.searchQuery || '';

            // Debounced search handler
            searchInput.addEventListener('input', function(e) {
                var query = e.target.value;
                KiddoPaint.Sprite.searchQuery = query;

                // Debounce the search
                if (KiddoPaint.Sprite.searchDebounceTimer) {
                    clearTimeout(KiddoPaint.Sprite.searchDebounceTimer);
                }

                KiddoPaint.Sprite.searchDebounceTimer = setTimeout(function() {
                    init_sprites_submenu().then(function() {
                        show_generic_submenu('sprites');
                        // Restore focus to search input
                        var input = document.getElementById('stamp-search-input');
                        if (input) {
                            input.focus();
                            input.setSelectionRange(query.length, query.length);
                        }
                    });
                }, 300);
            });

            searchContainer.appendChild(searchInput);
            genericsubmenu.appendChild(searchContainer);
            continue;
        }

        var button = document.createElement('button');
        button.className = 'tool';

        // title on hover
        button.title = buttonDetail.name;

        // display
        if (buttonDetail.invisible) {
            button.className += " invisible";
        } else if (buttonDetail.imgSrc) {
            var img = document.createElement('img');
            img.src = buttonDetail.imgSrc;
            img.className = 'toolImg pixelated';
            img.setAttribute('draggable', 'false');
            button.appendChild(img);
        } else if (buttonDetail.imgJs) {
            var img = document.createElement('img');
            img.src = buttonDetail.imgJs();
            img.className = 'pixelated';
            img.setAttribute('draggable', 'false');
            button.appendChild(img);
        } else if (buttonDetail.text) {
            var t = document.createTextNode(buttonDetail.text);
            button.appendChild(t);
        } else if (buttonDetail.emoji) {
            var emoji = document.createElement('emj');
            var text = document.createTextNode(buttonDetail.emoji);
            emoji.appendChild(text);
            button.appendChild(emoji);
        } else if (buttonDetail.spriteSheet) {
            var img = document.createElement('img');
            img.src = buttonDetail.spriteSheet;
            img.className = 'tool sprite sprite-pos-' + buttonDetail.spriteCol + '-' + buttonDetail.spriteRow;
            img.setAttribute('draggable', 'false');
            button.appendChild(img);
        } else {
            //		console.log(buttonDetail);
        }

        // click handler
        let localFRef = buttonDetail.handler;
        let subtoolName = buttonDetail.name;
        let wrappedHandler = function(e) {
            KiddoPaint.Sounds.submenuoption();
            localFRef(e);
            // Update the subtool name in the status bar
            KiddoPaint.Current.subtoolName = subtoolName;
            if (typeof updateStatusBar === 'function') {
                updateStatusBar();
            }
        };
        button.onclick = wrappedHandler;
        button.oncontextmenu = wrappedHandler;

        genericsubmenu.appendChild(button);
    }

}