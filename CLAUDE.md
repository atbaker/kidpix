# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JSKidPix is an HTML5/JavaScript reimplementation of the classic 1989 Kid Pix drawing program. The app runs entirely in the browser using HTML5 Canvas API and provides a nostalgic painting experience with whimsical tools, brushes, and sound effects.

**Live site**: https://kidpix.app/

### Claude Draws Project

This fork has been enhanced for the **Claude Draws** project, where Claude for Chrome creates original artworks based on requests from r/claudedraws. Key customizations include:

- **Status Bar**: Real-time display of current tool, active modifiers, and a 5-minute countdown timer
- **Programmatic Control**: On-screen toggle buttons (SHIFT, OPTION, CTRL) enable Claude to activate modifier keys programmatically
- **Canvas Size**: Adjusted to 800x600 for optimal artwork generation
- **Enhanced Accessibility**: Disabled image dragging and toolbar scrolling for reliable programmatic interaction

## Architecture

### Core Structure

The application uses a namespace-based architecture centered around the global `KiddoPaint` object with the following main modules:

- `KiddoPaint.Tools`: Drawing tools (brush, pencil, eraser, stamps, etc.)
- `KiddoPaint.Brushes`: Brush patterns and effects (bubbles, leaky pen, spray, etc.)
- `KiddoPaint.Textures`: Fill patterns and texture generators
- `KiddoPaint.Display`: Canvas management and rendering (main canvas, tmp overlay, preview, animations)
- `KiddoPaint.Sounds`: Audio playback for tool interactions
- `KiddoPaint.Colors`: Color palette management
- `KiddoPaint.Current`: Current state (active tool, color, modifiers)
- `KiddoPaint.Submenu`: Tool-specific submenu configurations

### File Organization

- `js/app.js`: **Concatenated production build** (400KB+). All individual JS files are bundled here.
- `js/init/kiddopaint.js`: Main initialization and entry point (`init_kiddo_paint()`)
- `js/init/submenus.js`: Submenu rendering system
- `js/tools/`: Individual tool implementations (48+ tools)
- `js/brushes/`: Brush pattern generators (14 brushes)
- `js/submenus/`: Tool submenu definitions (brush, eraser, pencil, etc.)
- `js/util/`: Utility functions (colors, filters, display, canvas operations)
- `js/sounds/sounds.js`: Audio library and sound effect mappings
- `js/stamps/`: Stamp graphics and alphabet characters
- `js/textures/`: Fill patterns and texture effects
- `index.html`: Single-page application entry point

### Canvas Layer System

The app uses **multiple layered canvases** for compositing:

1. **main_canvas**: Persistent drawing layer (saved state)
2. **canvas** (kiddopaint): Temporary drawing overlay cleared between operations
3. **previewCanvas**: Tool previews (e.g., shape outlines before finalizing)
4. **animCanvas**: Animation effects layer
5. **bnimCanvas**: Additional animation layer

Operations are typically drawn to the temporary canvas first, then committed to main_canvas on mouseup/tool completion.

### Tool Pattern

Tools follow a consistent interface pattern:

```javascript
KiddoPaint.Tools.Toolbox.ToolName = function() {
    this.mousedown = function(ev) { /* ... */ };
    this.mousemove = function(ev) { /* ... */ };
    this.mouseup = function(ev) { /* ... */ };
    // Optional: reset, texture, soundduring
};
```

### Submenu System

Each tool can have a submenu (defined in `js/submenus/*.js`) with multiple variants. Submenu items specify:
- `name`: Display name
- `imgSrc` or `emoji`: Visual representation
- `handler`: Function that configures the tool and assigns it to `KiddoPaint.Current.tool`

### State Management

- `KiddoPaint.Current.tool`: Active tool instance
- `KiddoPaint.Current.color`: Selected color
- `KiddoPaint.Current.modified`, `modifiedMeta`, `modifiedCtrl`: Modifier key states
- Undo system stores canvas snapshots in `KiddoPaint.Display.undoData`

### Status Bar and Modifier Controls

The status bar (bottom of the screen) displays real-time information:
- **Current Tool**: Name of the active tool
- **Active Modifiers**: Shows which modifier keys are active (SHIFT/OPTION/CTRL)
- **Timer**: 5-minute countdown for the Claude Draws project

Modifier toggle buttons allow programmatic control of modifier states:
```javascript
// Toggle modifiers programmatically by clicking the on-screen buttons
document.getElementById('shiftToggle').click();   // Toggle SHIFT
document.getElementById('optionToggle').click();  // Toggle OPTION
document.getElementById('ctrlToggle').click();    // Toggle CTRL
```

These toggles update `KiddoPaint.Current.modified`, `modifiedMeta`, and `modifiedCtrl` just like physical keyboard keys, enabling Claude to activate tool variations programmatically.

### Sound System

Sounds are pre-loaded Audio objects in `KiddoPaint.Sounds.Library` and played via helper functions (e.g., `KiddoPaint.Sounds.brushleakypen()`). The app includes hundreds of sound effects for tools, menus, and interactions.

## Development

### Build System

The project uses a build script (`build.sh`) to concatenate and format all JavaScript files:

```bash
./build.sh  # Formats code with js-beautify and builds js/app.js with uglify-es
```

The build script:
1. Cleans the old `js/app.js`
2. Formats all JS and CSS files using js-beautify
3. Concatenates all modular JS files into a single `js/app.js` using uglify-es
4. Adds a timestamp comment to the built file

### Running Locally

This is a static site - you can develop without building:

1. Open `index.html` directly in a browser, or
2. Use a local web server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

For production deployment, run `./build.sh` to generate the optimized `js/app.js`.

### Deployment

Deployment to GitHub Pages is automated via GitHub Actions (`.github/workflows/deploy.yml`):

1. Every push to `main` triggers the workflow
2. Checks out the code and installs Node.js dependencies
3. Runs `./build.sh` to generate `js/app.js`
4. Deploys the entire site to GitHub Pages

**No manual deployment is required** - just push to main and GitHub Actions handles the rest.

### Code Style

- Uses vanilla JavaScript (ES5-style, no transpilation)
- Global namespace pattern (`KiddoPaint.*`)
- Canvas 2D API with `imageSmoothingEnabled = false` for pixel art aesthetic
- Event handlers attached via `.addEventListener()` and inline HTML attributes

### Modifier Keys

The app heavily uses keyboard modifiers to alter tool behavior:
- **Shift**: Often enlarges brush/tool size
- **Option/Alt** (`modifiedMeta`): Activates alternative effects (e.g., rainbow colors)
- **Ctrl** (`modifiedCtrl`): Secondary variations
- On-screen toggle buttons simulate these modifiers for touch devices

### Debugging

- Browser DevTools console shows the global `KiddoPaint` object
- Canvas layers can be inspected in the DOM (`#kiddopaint`, `#main`, etc.)
- Sound issues: Check browser autoplay policies (Safari requires user interaction)

## Common Tasks

### Adding a New Brush

1. Create brush generator in `js/brushes/newbrush.js`:
   ```javascript
   KiddoPaint.Brushes.NewBrush = function(color) {
       // Return canvas with brush pattern
   };
   ```
2. Add submenu entry in `js/submenus/brush.js`:
   ```javascript
   {
       name: 'New Brush',
       imgSrc: 'img/brush-icon.png',
       handler: function() {
           KiddoPaint.Current.tool = KiddoPaint.Tools.PlainBrush;
           KiddoPaint.Tools.PlainBrush.texture = function() {
               return KiddoPaint.Brushes.NewBrush(KiddoPaint.Current.color);
           };
       }
   }
   ```
3. Rebuild `js/app.js` if using the production bundle

### Adding a New Tool

1. Create tool in `js/tools/newtool.js` following the tool pattern
2. Add toolbar button in `index.html` (if main tool, not submenu)
3. Wire up event handler in initialization code
4. Add to `ToolNames` mapping if it's a primary toolbar tool

### Modifying Canvas Rendering

All canvas operations go through `KiddoPaint.Display.*` helpers:
- Use `KiddoPaint.Display.saveUndo()` before destructive operations
- Call `KiddoPaint.Display.clearTmp()` to clear the temporary overlay
- Use `KiddoPaint.Display.clearBeforeSaveMain()` to commit drawings to the persistent layer

### Testing

No automated test suite. Manual testing checklist:
- Test in Chrome, Firefox, Safari
- Verify touch/mobile functionality
- Check modifier key combinations (Shift, Option, Ctrl)
- Confirm sounds play correctly
- Test undo functionality
- Verify save/export works

## Special Considerations

### Mobile/Touch Support

- On-screen modifier toggle buttons simulate keyboard modifiers
- Touch events should be converted to mouse events where needed
- Prevent default behaviors like text selection and image dragging

### Browser Compatibility

- Canvas API is well-supported, but watch for:
  - Audio autoplay restrictions (especially Safari)
  - `imageSmoothingEnabled` for pixel-perfect rendering
  - Memory limits with large undo stacks

### Performance

- Large app.js file (400KB+) is concatenated from all modules
- Lazy loading not implemented; all code loads at once
- Canvas operations are synchronous; complex brushes may cause jank

## Resources

- **Issues/Bugs**: https://github.com/vikrum/kidpix/issues
- **Wiki**: https://github.com/vikrum/kidpix/wiki
- **Gallery**: https://github.com/vikrum/kidpix/wiki/Gallery-of-Masterpieces
