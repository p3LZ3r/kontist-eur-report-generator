# AppIcon Component

Modern iOS 26-style app icon component with glassmorphism effects.

## Features

- 🎨 **iOS 26 Design Language**: Authentic rounded corners (22.5% radius)
- ✨ **Glassmorphism**: Backdrop blur with gradient overlays
- 🎭 **Floating Animation**: Subtle levitation effect (optional)
- 📱 **Responsive Sizing**: 4 size variants (sm, md, lg, xl)
- ⚡ **Performance**: Optimized with CSS transforms and GPU acceleration

## Usage

```tsx
import { AppIcon } from "@/components/ui/app-icon";

// Default usage (large, animated)
<AppIcon />

// Custom size
<AppIcon size="xl" />

// Without animation
<AppIcon animate={false} />

// With custom className
<AppIcon className="mx-auto" size="md" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"lg"` | Icon size variant |
| `animate` | `boolean` | `true` | Enable floating animation |
| `className` | `string` | `undefined` | Additional CSS classes |

## Size Reference

- **sm**: 48x48px (3rem)
- **md**: 64x64px (4rem)
- **lg**: 80x80px (5rem) ⭐ Default
- **xl**: 96x96px (6rem)

## Design Details

### iOS 26 Styling
- Corner radius: 22.5% (authentic iOS app icon shape)
- Layered shadows: Combines subtle and prominent shadows for depth
- Gradient: White to light blue (Blue-50/Blue-100) for optimal logo contrast

### Effects
1. **Glassmorphism**: Backdrop blur with semi-transparent gradient
2. **Light Reflection**: Top-left glow for realistic lighting

### Animations
- **Float**: 6s ease-in-out infinite vertical movement (optional)

## Accessibility

- ✅ Semantic HTML structure
- ✅ Alt text on logo image
- ✅ Reduced motion friendly (animations use CSS transforms)
- ✅ High contrast gradients for visibility

## Performance

- Uses CSS transforms (GPU-accelerated)
- Memo-ized component to prevent unnecessary re-renders
- Optimized backdrop-blur for 60fps animations
- SVG logo loaded from public directory (cached)

## Integration

Currently used in:
- [HeroSection.tsx](../euer-generator/HeroSection.tsx:19) - Main hero area

## Customization

### Change Colors
Edit the gradient classes in `app-icon.tsx`:
```tsx
"bg-gradient-to-br from-white via-blue-50/40 to-blue-100/60"
```

### Adjust Corner Radius
Modify the `rounded-[22.5%]` class to change the iOS-style corners.

### Animation Speed
Update Tailwind config keyframes in `tailwind.config.js`:
```js
keyframes: {
  float: {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" }, // Adjust -10px for height
  }
}
```

## Browser Support

- ✅ Chrome/Edge 88+ (backdrop-blur)
- ✅ Firefox 103+ (backdrop-blur)
- ✅ Safari 15.4+ (backdrop-blur)
- ⚠️ Fallback: Solid gradient without blur on older browsers

## Related Files

- [app-icon.tsx](./app-icon.tsx) - Component implementation
- [HeroSection.tsx](../euer-generator/HeroSection.tsx) - Usage example
- [tailwind.config.js](../../../tailwind.config.js) - Animation configuration
- [EUR-Generator-Logo.svg](../../../public/EUR-Generator-Logo.svg) - Source logo

---

**Created**: 2025-10-16
**Style**: iOS 26 Design Language
**Library**: Radix UI + Tailwind CSS
