# Sprite Labeling Workflow

This directory contains tools for manually labeling all KidPix sprites with human-readable names.

## Overview

The KidPix app has 980 sprites across 10 sprite sheets (14 columns × 7 rows per sheet). Adding semantic labels to these sprites helps Claude for Chrome create more intelligible and entertaining artwork.

## Files

- **label-sprites.html** - **RECOMMENDED** Interactive labeling interface (fastest method!)
- **sprite-labels-template.json** - Template with "TODO" placeholders for all 980 sprites
- **sprite-reference.html** - Visual reference showing all sprites with coordinates
- **json-to-js.js** - Converts completed JSON to JavaScript module
- **extract-sprites.html** - (Optional) Utility for extracting individual sprite images

## Workflow

### Option A: Interactive Labeling (Recommended - Fastest!)

1. **Open the interactive labeler:**
   ```bash
   open scripts/label-sprites.html
   ```

2. **Label sprites rapidly:**
   - See one sprite at a time (large, clear preview)
   - Type label → Press Enter → Next sprite automatically
   - Progress auto-saved in browser every time
   - Use keyboard shortcuts for efficiency

3. **Save your work:**
   - Click "Copy JSON" to copy to clipboard
   - Paste into `scripts/sprite-labels.json` in your editor
   - Or click "Download JSON" to save directly

4. **Continue later:**
   - Your progress is saved in the browser
   - Just reopen `label-sprites.html` to resume
   - Or load your saved JSON file with "Load Existing JSON"

5. **Convert and build:**
   ```bash
   node scripts/json-to-js.js
   ./build.sh
   ```

**Interactive Features:**
- Real-time progress bar
- Jump to any sprite (by sheet/row/col)
- Skip to next unlabeled sprite
- Recent labels (click to reuse)
- Keyboard shortcuts for speed
- Auto-save to browser storage

### Option B: Manual JSON Editing (Original Method)

### Step 1: Set Up Your Workspace

1. Copy the template to create your working file:
   ```bash
   cp scripts/sprite-labels-template.json scripts/sprite-labels.json
   ```

2. Open the visual reference in your browser:
   ```bash
   open scripts/sprite-reference.html
   ```
   (or manually navigate to `file:///path/to/kidpix/scripts/sprite-reference.html`)

3. Open `scripts/sprite-labels.json` in your text editor

### Step 2: Label the Sprites

1. In the browser, hover over any sprite to see its coordinates: `[Sheet, Row, Col]`

2. In your JSON editor, find that sprite's position:
   - Sheet number is the top-level key (`"0"` through `"9"`)
   - Row number is the second level (`"0"` through `"6"`)
   - Column index is the position in the array (`0` through `13`)

3. Replace `"TODO"` with a descriptive label

**Example:**

If you see a palm tree at coordinates `[0, 0, 0]`:

```json
{
  "0": {
    "0": ["palm tree", "TODO", "TODO", ...]
  }
}
```

**Labeling Guidelines:**
- Use lowercase
- Keep it short and descriptive
- Use common names Claude would recognize
- Examples: "palm tree", "rocket ship", "elephant", "bicycle"
- For abstract shapes: "star", "circle", "pattern", etc.

### Step 3: Convert to JavaScript

Once you've labeled all (or some) sprites:

```bash
node scripts/json-to-js.js
```

This will:
- Read `scripts/sprite-labels.json`
- Validate the labels
- Generate `js/data/sprite-labels.js`
- Report any remaining "TODO" entries

The script will warn you about unlabeled sprites but will continue and use "unlabeled sprite" as a fallback.

### Step 4: Build and Test

```bash
./build.sh
```

Then open `index.html` in your browser and test:
1. Click the Rubber Stamps tool
2. Browse through the sprite sheets
3. Hover over sprites to see your labels in the tooltip
4. Click a sprite and check the status bar - it should show your label

## Tips

- **Work in batches**: Label one sheet at a time, then convert and test
- **Use search**: Many sprites appear multiple times; label one, then search/replace
- **Keep reference.html open**: Side-by-side with your editor makes it easier
- **Check progress**: The conversion script tells you how many are left
- **It's okay to skip**: The system falls back to "Sprite N" if labels are missing

## File Structure

```
scripts/
├── README.md                      # This file
├── label-sprites.html             # Interactive labeling interface (RECOMMENDED)
├── sprite-labels-template.json    # Template (don't edit directly)
├── sprite-labels.json             # Your working file (create this)
├── sprite-reference.html          # Visual reference
├── json-to-js.js                  # Conversion script
└── extract-sprites.html           # (Optional) Individual sprite extractor

js/data/
└── sprite-labels.js               # Auto-generated (don't edit)
```

## Troubleshooting

**Problem**: Conversion script says "file not found"
- Make sure you've created `sprite-labels.json` from the template

**Problem**: Labels don't show up in the app
- Did you run `./build.sh` after conversion?
- Check browser console for JavaScript errors
- Verify `js/data/sprite-labels.js` exists

**Problem**: Want to start over
- Just copy the template again: `cp sprite-labels-template.json sprite-labels.json`

## Progress Tracking

Check your progress:
```bash
grep -o "TODO" scripts/sprite-labels.json | wc -l
```

This shows how many sprites remain unlabeled.

## Contributing

When you're done labeling (or have made significant progress), the labels will be committed to the repository and Claude for Chrome will immediately benefit from the improved semantic information!
