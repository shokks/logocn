# LogoCN - Simple Usage Guide

## Philosophy
LogoCN keeps things simple. We store SVG files and provide a TypeScript-friendly map of paths. That's it.

## Installation

```bash
npx logocn@latest init
```

This creates:
- `components/logos/` - Where SVG files are stored
- `lib/logos.ts` - Export map with all logo paths

## Adding Logos

```bash
npx logocn add react github twitter
```

This downloads the SVG files and updates `lib/logos.ts` automatically.

## Usage

### For Next.js / React

```tsx
import { logos } from '@/lib/logos'

export default function MyComponent() {
  return (
    <div>
      {/* Simple img tag */}
      <img src={logos.react} alt="React" width={48} height={48} />
      
      {/* With Next.js Image (for optimized loading) */}
      <Image src={logos.github} alt="GitHub" width={48} height={48} />
      
      {/* Dynamic selection */}
      <img src={logos[iconName]} alt={iconName} />
    </div>
  )
}
```

### For Vue

```vue
<template>
  <div>
    <img :src="logos.vuedotjs" alt="Vue" width="48" height="48" />
  </div>
</template>

<script>
import { logos } from '@/lib/logos'

export default {
  data() {
    return { logos }
  }
}
</script>
```

### For Vanilla HTML/JS

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { logos } from './lib/logos.js';
    
    document.getElementById('logo').src = logos.javascript;
  </script>
</head>
<body>
  <img id="logo" alt="JavaScript" width="48" height="48" />
</body>
</html>
```

## What You Get

After running `logocn add react github`:

**lib/logos.ts:**
```typescript
export const logos = {
  react: '/components/logos/react.svg',
  github: '/components/logos/github.svg',
} as const

export type LogoName = keyof typeof logos
```

**Your project:**
```
components/
  logos/
    react.svg
    github.svg
lib/
  logos.ts
```

## That's It!

- ✅ **Simple**: Just paths to SVG files
- ✅ **Type-safe**: TypeScript knows all available logos
- ✅ **Framework-agnostic**: Works everywhere
- ✅ **Zero complexity**: No components, no magic, just files

## Need SVGs as React Components?

If you need to import SVGs as React components (for styling with props), configure your bundler:

**Next.js (next.config.js):**
```javascript
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  }
}
```

Then import directly:
```tsx
import ReactLogo from '@/components/logos/react.svg'

<ReactLogo width={48} height={48} fill="currentColor" />
```

But for 99% of use cases, the simple path map is all you need!