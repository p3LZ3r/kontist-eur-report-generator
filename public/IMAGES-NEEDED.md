# Required Images for SEO & PWA

## Social Media Image (High Priority)

### og-image.png
- **Size**: 1200 x 630 pixels
- **Format**: PNG or JPG
- **Location**: `/public/og-image.png`
- **Purpose**: Social media sharing preview (Facebook, Twitter, LinkedIn)
- **Content Suggestions**:
  - App screenshot with logo
  - Text: "EÜR Generator für ELSTER"
  - Clean, professional design
  - Brand colors: Blue (#2563eb)

### Design Tips:
- Keep important content in the center (safe zone)
- Use high contrast for readability
- Include app name prominently
- Show key features or benefits
- Avoid small text (will be hard to read when scaled down)

## PWA Icons (Medium Priority)

### icon-192.png
- **Size**: 192 x 192 pixels
- **Format**: PNG with transparency
- **Location**: `/public/icon-192.png`
- **Purpose**: Android home screen icon, splash screen

### icon-512.png
- **Size**: 512 x 512 pixels
- **Format**: PNG with transparency
- **Location**: `/public/icon-512.png`
- **Purpose**: High-resolution PWA icon, app drawer

### Icon Design Guidelines:
- Simple, recognizable design
- Works well at small sizes
- Transparent background
- Centered with padding
- Brand colors
- Could be: Calculator icon, Euro symbol, or stylized "EÜR"

## Favicon (Already Present)

### Current
- `/vite.svg` - Should be replaced with branded icon

### Recommended
Create a favicon set:
- `favicon.ico` (16x16, 32x32, 48x48 multi-resolution)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)

## Quick Generation Tools

### Online Tools
1. **Favicon Generator**: https://realfavicongenerator.net/
2. **PWA Icon Generator**: https://www.pwabuilder.com/
3. **OG Image Generator**: https://www.opengraph.xyz/
4. **Canva**: https://www.canva.com/ (for design)

### Design Software
- Figma (free online)
- Adobe Photoshop
- GIMP (free)
- Inkscape (free, vector)

## Brand Guidelines

### Colors
- **Primary**: #2563eb (Blue)
- **Secondary**: #ffffff (White)
- **Accent**: Consider adding a secondary accent color

### Typography
- Clean, professional sans-serif fonts
- Good readability

### Style
- Modern, minimalist
- Trust-inspiring (it's a financial tool)
- German-friendly aesthetic

## Implementation Checklist

Once images are created:
- [ ] Place og-image.png in `/public/`
- [ ] Place icon-192.png in `/public/`
- [ ] Place icon-512.png in `/public/`
- [ ] Replace vite.svg with branded favicon
- [ ] Test og-image with https://www.opengraph.xyz/
- [ ] Test PWA icons on Android device
- [ ] Validate favicon with https://realfavicongenerator.net/favicon_checker

## Example Content for OG Image

```
╔══════════════════════════════════════════╗
║                                          ║
║           [App Icon/Logo]                ║
║                                          ║
║        EÜR Generator für ELSTER          ║
║                                          ║
║    ✓ Kontist & Holvi CSV Import         ║
║    ✓ Automatische Kategorisierung       ║
║    ✓ ELSTER-kompatibel                  ║
║                                          ║
║    www.eür-generator.de              ║
║                                          ║
╚══════════════════════════════════════════╝
```
