# Icon Conversion Instructions

VS Code Marketplace requires PNG format for extension icons, not SVG.

## Convert icon.svg to icon.png

### Option 1: Using ImageMagick (Command Line)
```bash
cd media
convert icon.svg -resize 256x256 icon.png
```

### Option 2: Using Inkscape (Command Line)
```bash
inkscape media/icon.svg --export-filename=media/icon.png --export-width=256 --export-height=256
```

### Option 3: Using Node.js (sharp library)
```bash
npm install --save-dev sharp
node -e "require('sharp')('media/icon.svg').resize(256, 256).png().toFile('media/icon.png')"
```

### Option 4: Online Converter
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `media/icon.svg`
3. Convert to PNG at 256×256
4. Download as `icon.png` to `media/` folder

### Option 5: Manual (macOS/Linux)
1. Open `media/icon.svg` in your browser
2. Take a screenshot or use browser dev tools to export
3. Resize to 256×256 in Preview/GIMP/Photoshop
4. Save as `media/icon.png`

## After Conversion

Update `package.json`:
```json
"icon": "media/icon.png",
```

The SVG file can remain for reference or future use, but the PNG is required for packaging.
