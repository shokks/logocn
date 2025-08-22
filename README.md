# LogoCN

Add SVG logos to your project with a single command. Just like [shadcn/ui](https://ui.shadcn.com), but for logos.

[![Follow on X](https://img.shields.io/twitter/follow/5aikat?style=social)](https://x.com/5aikat)

```bash
npx logocn@latest add react
```

## Features

✨ **2,800+ logos** from Simple Icons  
⚡ **Zero config** - works out of the box  
🎨 **Brand colors** included  
📦 **Framework agnostic** - just SVG files  
🚀 **React components** auto-generated  
💾 **Offline support** with smart caching  

## Quick Start

```bash
# Initialize (optional - for React component generation)
npx logocn@latest init

# Add logos to your project
npx logocn@latest add tesla apple palantir

# That's it! Logos are in your project
```

## Common Workflows

### First time setup
```bash
npx logocn@latest init        # Set up for your framework
npx logocn@latest add github   # Add your first logo
```

### Adding multiple logos
```bash
npx logocn@latest add tesla openai microsoft shadcn
```

### Finding and adding logos
```bash
npx logocn@latest search database    # Find database logos
npx logocn@latest add postgresql     # Add the one you want
```

### Updating existing logos
```bash
npx logocn@latest update             # Update cache with latest logos
npx logocn@latest remove oldlogo     # Remove old version
npx logocn@latest add newlogo        # Add new version
```

## Installation

### Use without installing (recommended)

```bash
npx logocn@latest add [logo-name]
```

### Global installation

```bash
npm install -g logocn
logocn add [logo-name]
```

## Commands

### Initialize project

Set up LogoCN for your framework with optimal configuration:

```bash
logocn init

# Options:
logocn init --force           # Force re-initialization
logocn init --skip-install    # Skip dependency installation
logocn init --yes            # Use defaults without prompts
```

### Add logos

```bash
# Add a single logo
logocn add tesla

# Add multiple logos
logocn add apple google microsoft tesla

# Interactive mode - search, browse, or select popular logos
logocn add
```

### Remove logos

```bash
# Remove a single logo
logocn remove tesla
# or use alias
logocn rm tesla

# Remove multiple logos
logocn remove apple google angular
```

### Search for logos

```bash
# Search by name or keyword
logocn search google
logocn search meta
logocn search database
```

### List available logos

```bash
# List all logos (paginated, 50 per page)
logocn list

# View specific page
logocn list --page 2

# Search within list
logocn list --search "meta"
```

### Update cache

Update the Simple Icons metadata cache:

```bash
logocn update
```

### Configuration

```bash
# View all configuration
logocn config --list

# Get specific value
logocn config --get logoDirectory

# Set configuration value
logocn config --set dir=./assets/logos

# Reset to defaults
logocn config --reset
```

## Framework Setup

LogoCN works with any framework. Run `init` for optimal setup:

```bash
npx logocn@latest init
```

This will:
- Detect your framework (Next.js, React, Vue, etc.)
- Set up the best directory structure
- Configure React component generation (if applicable)
- Add TypeScript support (if detected)

### Default directories by framework

- **Next.js**: `components/logos`
- **React**: `src/components/logos`
- **Vue**: `src/components/logos`
- **Angular**: `src/assets/logos`
- **Others**: `logos`

## Using logos in your project

### As SVG files

```jsx
// Logos are saved as SVG files
import appleLogo from './components/logos/apple.svg'

<img src={appleLogo} alt="Apple" />
```

### As React components (after init)

```jsx
// Auto-generated index file with all logos
import { AppleLogo, GoogleLogo } from '@/components/logos'

// Use with size and color props
<AppleLogo size={48} />
<GoogleLogo size={32} color="#4285F4" />
```

### Component props

All generated React components accept:
- `size` - Width and height (number or string)
- `color` - Fill color (defaults to brand color)
- `width` - Custom width
- `height` - Custom height
- All standard SVG props

## React Component Examples

### Basic usage

```jsx
import { GithubLogo, TwitterLogo } from '@/components/logos'

export function SocialLinks() {
  return (
    <div className="flex gap-4">
      <GithubLogo size={24} />
      <TwitterLogo size={24} />
    </div>
  )
}
```

### With custom colors

```jsx
import { TeslaLogo } from '@/components/logos'

// Override default brand color
<TeslaLogo size={48} color="#CC0000" />

// Use with Tailwind classes
<TeslaLogo size={48} className="text-red-500" />

// Dynamic colors
<TeslaLogo size={48} color={isDark ? '#fff' : '#000'} />
```

### Responsive sizing

```jsx
import { AppleLogo } from '@/components/logos'

// Responsive sizes
<AppleLogo className="w-8 h-8 md:w-12 md:h-12" />

// Custom width/height
<AppleLogo width={100} height={50} />

// Using viewport units
<AppleLogo size="5vw" />
```

### With hover effects

```jsx
import { SpotifyLogo } from '@/components/logos'

export function MusicPlayer() {
  return (
    <button className="group">
      <SpotifyLogo 
        size={32}
        className="transition-colors group-hover:text-green-500"
      />
    </button>
  )
}
```

### With TypeScript

```tsx
import { FC } from 'react'
import { GithubLogo, LinkedinLogo } from '@/components/logos'

interface SocialLinkProps {
  platform: 'github' | 'linkedin'
  size?: number
  color?: string
}

export const SocialLink: FC<SocialLinkProps> = ({ 
  platform, 
  size = 24, 
  color 
}) => {
  const logos = {
    github: GithubLogo,
    linkedin: LinkedinLogo,
  }
  
  const Logo = logos[platform]
  
  return <Logo size={size} color={color} />
}
```

### Company showcase

```jsx
import { 
  AppleLogo,
  GoogleLogo,
  MicrosoftLogo,
  TeslaLogo,
  AmazonLogo
} from '@/components/logos'

export function TrustedByCompanies() {
  const companies = [
    { Logo: AppleLogo, name: 'Apple' },
    { Logo: GoogleLogo, name: 'Google' },
    { Logo: MicrosoftLogo, name: 'Microsoft' },
    { Logo: TeslaLogo, name: 'Tesla' },
    { Logo: AmazonLogo, name: 'Amazon' },
  ]
  
  return (
    <div className="flex flex-wrap gap-8 items-center">
      {companies.map(({ Logo, name }) => (
        <div key={name} className="opacity-60 hover:opacity-100 transition-opacity">
          <Logo size={48} />
        </div>
      ))}
    </div>
  )
}
```

### Payment methods

```jsx
import { 
  VisaLogo,
  MastercardLogo,
  PaypalLogo,
  StripeLogo,
  AppleLogo
} from '@/components/logos'

export function PaymentMethods() {
  return (
    <div className="flex gap-3">
      <VisaLogo size={40} />
      <MastercardLogo size={40} />
      <PaypalLogo size={40} />
      <StripeLogo size={40} />
      <div className="flex items-center gap-1">
        <AppleLogo size={20} />
        <span>Pay</span>
      </div>
    </div>
  )
}
```

### Animated logos

```jsx
import { LoaderLogo } from '@/components/logos'

export function Loading() {
  return (
    <div className="animate-spin">
      <LoaderLogo size={32} />
    </div>
  )
}

// Or with custom animation
export function PulsingLogo() {
  return (
    <div className="animate-pulse">
      <HeartLogo size={32} color="#ef4444" />
    </div>
  )
}
```

### With tooltips

```jsx
import { InfoLogo } from '@/components/logos'
import { Tooltip } from '@/components/ui/tooltip'

export function InfoButton() {
  return (
    <Tooltip content="Click for more information">
      <button>
        <InfoLogo size={16} />
      </button>
    </Tooltip>
  )
}


## Uninstalling

### Remove from project

```bash
# Clean up LogoCN files from current project
logocn uninstall

# Keep logos but remove config
logocn uninstall --keep-logos

# Skip confirmation prompts
logocn uninstall --yes
```

### Global uninstall

```bash
# npm
npm uninstall -g logocn

# yarn
yarn global remove logocn

# pnpm
pnpm remove -g logocn
```

### Manual cleanup

If you need to manually clean up:

```bash
# Remove project config
rm logocn.config.json

# Remove logos (optional)
rm -rf components/logos

# Remove global cache
rm -rf ~/.logocn
```

## Examples

### Next.js

```bash
npx logocn@latest init
npx logocn@latest add github twitter linkedin
```

```jsx
// pages/index.js
import { GithubLogo, TwitterLogo, LinkedinLogo } from '@/components/logos'

export default function Home() {
  return (
    <div className="flex gap-4">
      <GithubLogo size={32} />
      <TwitterLogo size={32} />
      <LinkedinLogo size={32} />
    </div>
  )
}
```

### React + Vite

```bash
npx logocn@latest init
npx logocn@latest add react vite typescript
```

```jsx
// src/App.jsx
import { ReactLogo, ViteLogo, TypescriptLogo } from './components/logos'

function App() {
  return (
    <>
      <ReactLogo size={48} />
      <ViteLogo size={48} />
      <TypescriptLogo size={48} />
    </>
  )
}
```

### Vue

```bash
npx logocn@latest init
npx logocn@latest add vue nuxt vuetify
```

```vue
<!-- App.vue -->
<template>
  <div>
    <img src="@/components/logos/vue.svg" alt="Vue" />
    <img src="@/components/logos/nuxt.svg" alt="Nuxt" />
  </div>
</template>
```

## Available Logos

LogoCN provides access to 2,800+ logos from Simple Icons, including:

- **Tech Companies**: Apple, Google, Microsoft, Amazon, Meta, IBM, Intel, Samsung
- **Development**: React, Vue, Angular, Node.js, Python, TypeScript, Go, Rust
- **Databases**: PostgreSQL, MongoDB, MySQL, Redis, SQLite, Elasticsearch
- **Cloud Services**: AWS, Google Cloud, Azure, Vercel, Netlify, Cloudflare
- **Payment**: Stripe, PayPal, Square, Visa, Mastercard, American Express
- **Social Media**: Twitter/X, LinkedIn, GitHub, Discord, Slack, Instagram
- **Design Tools**: Figma, Sketch, Adobe, Canva, Framer, InVision
- **And thousands more...**

Use `logocn list` to see all available logos or `logocn search [keyword]` to find specific ones.

## Special Cases

### Logos starting with numbers

Logos like "1password" or "4chan" are prefixed with "Lcn" in React components:

```jsx
import { Lcn1passwordLogo, Lcn4chanLogo } from '@/components/logos'
```

## Troubleshooting

### "Logo not found"
- Check spelling: `logocn search [partial-name]`
- View all available: `logocn list`
- Update cache: `logocn update`

### "Permission denied"
- Check write permissions for the logo directory
- Try a different directory: `logocn config --set dir=./public/logos`

### React components not generating
- Run `logocn init` to set up your project
- Ensure you have `@svgr/webpack` installed (auto-installed by init)

## Command Reference

| Command | Description | Options |
|---------|-------------|---------|
| `init` | Initialize LogoCN in your project | `--force`, `--skip-install`, `--yes` |
| `add [logos...]` | Add logo(s) to project | Interactive mode if no args |
| `remove [logos...]` | Remove logo(s) from project | Alias: `rm` |
| `list` | List all available logos (paginated) | `--page <n>`, `--search <query>` |
| `search <query>` | Search for logos | Required: query string |
| `update` | Update Simple Icons cache | None |
| `config` | Manage configuration | `--list`, `--get <key>`, `--set <key=val>`, `--reset` |

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/logocn.git
cd logocn

# Install dependencies
npm install

# Build
npm run build

# Test locally
npm link
logocn add react
```

## How it works

1. **Simple Icons CDN**: Fetches SVG logos from the Simple Icons CDN
2. **Smart caching**: Caches logo metadata for 7 days for offline support
3. **Direct downloads**: Downloads SVG files directly to your project
4. **No dependencies**: Logos become part of your codebase
5. **Component generation**: Optionally generates React components with TypeScript

## License

MIT

## Author

**Created by [@5aikat](https://x.com/5aikat)**

## Credits

- Logo source: [Simple Icons](https://simpleicons.org)
- Inspired by: [shadcn/ui](https://ui.shadcn.com)

---

<p align="center">
  Made with ❤️ by developers, for developers
</p>