# LogoCN

Add SVG logos to your project with a single command. Just like [shadcn/ui](https://ui.shadcn.com), but for logos.

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
npx logocn@latest add react vue angular

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
npx logocn@latest add react nodejs mongodb stripe
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
logocn add react

# Add multiple logos
logocn add react vue angular nodejs

# Interactive mode - browse and select
logocn add
```

### Remove logos

```bash
# Remove a single logo
logocn remove react
# or use alias
logocn rm react

# Remove multiple logos
logocn remove react vue angular
```

### Search for logos

```bash
# Search by name or keyword
logocn search social
logocn search payment
logocn search "google"
```

### List available logos

```bash
# List all logos
logocn list

# With pagination
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

## Logo Categories

- **Tech**: Apple, Google, Microsoft, Amazon, Meta
- **Development**: React, Vue, Angular, Node.js, Python
- **Database**: PostgreSQL, MongoDB, MySQL, Redis
- **Cloud**: AWS, Google Cloud, Azure, Vercel
- **Payment**: Stripe, PayPal, Square, Visa
- **Social**: Twitter/X, LinkedIn, GitHub, Discord
- **Design**: Figma, Sketch, Adobe, Canva
- **And 2,800+ more...**

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
| `add [logos...]` | Add logo(s) to project | Interactive if no args |
| `remove [logos...]` | Remove logo(s) from project | Alias: `rm` |
| `list` | List all available logos | `--page <n>`, `--search <query>` |
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

## Credits

- Logo source: [Simple Icons](https://simpleicons.org)
- Inspired by: [shadcn/ui](https://ui.shadcn.com)

---

<p align="center">
  Made with ❤️ by developers, for developers
</p>

<p align="center">
  <a href="https://github.com/yourusername/logocn">GitHub</a> •
  <a href="https://www.npmjs.com/package/logocn">npm</a> •
  <a href="https://github.com/yourusername/logocn/issues">Issues</a>
</p>