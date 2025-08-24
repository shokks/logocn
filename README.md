# logoCN

![logoCN - Add logo components to your project with a single command](https://raw.githubusercontent.com/shokks/logocn/main/public/opengraph.png)

Add production-ready logo components to your project. Just like shadcn/ui, but for logos.

```bash
npx logocn@latest init        # One-time setup
npx logocn@latest add tesla   # Add components
```

[![npm version](https://img.shields.io/npm/v/logocn.svg)](https://www.npmjs.com/package/logocn)
[![Follow on X](https://img.shields.io/twitter/follow/5aikat?style=social)](https://x.com/5aikat)

## What is this?

**logoCN** lets you add any of 3,300+ logo components to your project with a single command. No packages to install. No dependencies. Just copy and paste.

- ✓ **React components** with TypeScript support and brand colors
- ✓ **Zero dependencies** - components are added directly to your project
- ✓ **Brand colors** included as default props
- ✓ **SVG files** also included for use in any framework
- ✓ **Works everywhere** - optimized for React/Next.js, compatible with all frameworks

## Quick Start

### For React/Next.js Projects

```bash
# Initialize LogoCN (one-time setup)
npx logocn@latest init

# Add logo components
npx logocn@latest add apple google microsoft
```

Now import and use:

```jsx
import { AppleLogo, GoogleLogo, MicrosoftLogo } from '@/components/logos'

<AppleLogo size={48} />        // Uses Apple's brand color
<GoogleLogo className="w-8" />  // With Tailwind
<MicrosoftLogo color="#fff" /> // Custom color
```

**Note:** If you've already added logos before running `init`, the init command will automatically generate components for all existing logos.

### For Other Frameworks

```bash
# Add logos as SVG files (no init needed)
npx logocn@latest add apple google microsoft
```

SVG files will be saved to `components/logos/` for use in Vue, Angular, Svelte, or vanilla HTML.

## Usage

### React Components

```jsx
import { GithubLogo, AppleLogo } from '@/components/logos'

// Default size and brand color
<GithubLogo />

// Custom size
<AppleLogo size={48} />

// Custom color
<GithubLogo color="#fff" />

// Tailwind classes
<AppleLogo className="w-8 h-8 text-slate-900" />
```

### SVG Files

```jsx
// React/Next.js
import logo from './components/logos/github.svg'
<img src={logo} alt="GitHub" />

// Vue
<template>
  <img src="@/components/logos/github.svg" alt="GitHub" />
</template>

// HTML
<img src="components/logos/github.svg" alt="GitHub" />
```

### All Props

- `size` - Width and height (number or string)
- `color` - Fill color (defaults to brand color)
- `width` / `height` - Individual dimensions
- `className` - CSS classes
- All standard SVG props

## Examples

<details>
<summary><strong>Next.js App</strong></summary>

```bash
# Initialize and add logos
npx logocn@latest init
npx logocn@latest add github twitter linkedin
```

```jsx
// app/page.tsx
import { GithubLogo, TwitterLogo, LinkedinLogo } from '@/components/logos'

export default function Home() {
  return (
    <footer className="flex gap-4">
      <GithubLogo size={20} />      {/* GitHub's brand color */}
      <TwitterLogo size={20} />      {/* Twitter's brand color */}
      <LinkedinLogo size={20} />     {/* LinkedIn's brand color */}
    </footer>
  )
}
```
</details>

<details>
<summary><strong>Company Logos Section</strong></summary>

```jsx
import { AppleLogo, GoogleLogo, MicrosoftLogo } from '@/components/logos'

const companies = [
  { name: 'Apple', Logo: AppleLogo },
  { name: 'Google', Logo: GoogleLogo },
  { name: 'Microsoft', Logo: MicrosoftLogo },
]

export function TrustedBy() {
  return (
    <div className="flex gap-12 items-center opacity-60">
      {companies.map(({ name, Logo }) => (
        <Logo key={name} size={48} />
      ))}
    </div>
  )
}
```
</details>

<details>
<summary><strong>Payment Methods</strong></summary>

```jsx
import { VisaLogo, MastercardLogo, PaypalLogo } from '@/components/logos'

export function PaymentMethods() {
  return (
    <>
      <VisaLogo size={40} />
      <MastercardLogo size={40} />
      <PaypalLogo size={40} />
    </>
  )
}
```
</details>

<details>
<summary><strong>With TypeScript</strong></summary>

```tsx
import { type FC } from 'react'
import { GithubLogo, LinkedinLogo } from '@/components/logos'

const logoMap = {
  github: GithubLogo,
  linkedin: LinkedinLogo,
} as const

interface SocialLinkProps {
  platform: keyof typeof logoMap
  size?: number
}

export const SocialLink: FC<SocialLinkProps> = ({ platform, size = 24 }) => {
  const Logo = logoMap[platform]
  return <Logo size={size} />
}
```
</details>

## Available Logos

3,300+ logos from [Simple Icons](https://simpleicons.org) including:

**Tech:** Apple, Google, Microsoft, Amazon, Tesla, OpenAI, Meta  
**Dev Tools:** GitHub, GitLab, VS Code, Figma, Vercel, Netlify  
**Languages:** JavaScript, TypeScript, Python, Go, Rust, Swift  
**Frameworks:** React, Vue, Angular, Next.js, Nuxt, Svelte  
**Databases:** PostgreSQL, MongoDB, MySQL, Redis, Supabase  
**Payment:** Stripe, PayPal, Square, Visa, Mastercard  
**Social:** Twitter/X, LinkedIn, Discord, Slack, Reddit  

```bash
# See all available logos
npx logocn@latest list

# Search for specific logos
npx logocn@latest search database
```

## Commands

### Essential Commands

```bash
npx logocn@latest add [logos...]    # Add logos to your project
npx logocn@latest remove [logos...]  # Remove logos
npx logocn@latest search <query>     # Find logos
npx logocn@latest list               # Browse all logos
```

### Setup & Config

```bash
npx logocn@latest init               # Set up React components
npx logocn@latest config             # View/change settings
npx logocn@latest uninstall          # Clean up LogoCN
```

<details>
<summary><strong>All Command Options</strong></summary>

#### `init`
```bash
logocn init --force           # Reinitialize
logocn init --skip-install    # Skip dependency installation
logocn init --yes            # Accept all defaults
```

#### `add`
```bash
logocn add tesla              # Add single logo
logocn add apple google       # Add multiple
logocn add                    # Interactive mode
logocn add tesla --keep-svgs  # Keep SVG files after generating components
```

#### `config`
```bash
logocn config --list                    # Show all settings
logocn config --get logoDirectory       # Get specific value
logocn config --set dir=./public/logos  # Change directory
logocn config --set keepSvgs=false      # Remove SVGs after component generation
logocn config --reset                   # Reset to defaults
```

#### `list`
```bash
logocn list --page 2          # View specific page
logocn list --search meta     # Filter results
```

#### `uninstall`
```bash
logocn uninstall --yes        # Skip confirmation
logocn uninstall --keep-logos # Keep SVG files
```
</details>

## FAQ

<details>
<summary><strong>Where are logos saved?</strong></summary>

By default in `components/logos/`. Run `logocn init` to auto-detect the best location for your framework, or use `logocn config --set dir=./your/path` to customize.
</details>

<details>
<summary><strong>Do I need to install LogoCN?</strong></summary>

No! Just use `npx logocn@latest`. If you prefer, you can install globally with `npm i -g logocn`.
</details>

<details>
<summary><strong>How do React components work?</strong></summary>

Run `logocn init` once to enable component generation. After that, every logo you add creates a ready-to-use React component with TypeScript types and brand colors built in.

If you've already added logos before initialization, `init` will generate components for all existing logos automatically.
</details>

<details>
<summary><strong>What about logos starting with numbers?</strong></summary>

Logos like "1password" become `Lcn1passwordLogo` components (prefixed with "Lcn") to be valid JavaScript identifiers.
</details>

<details>
<summary><strong>Can I remove SVG files after generating components?</strong></summary>

Yes! By default, LogoCN removes the original SVG files after generating React components to save space. The components contain all the SVG data inline. You can control this behavior:

- During init: You'll be asked if you want to keep original SVG files
- Via config: `logocn config --set keepSvgs=true` to keep SVGs
- Per command: `logocn add tesla --keep-svgs` to keep SVGs for that operation

This helps reduce bundle size since the component already contains the full SVG.
</details>

<details>
<summary><strong>Can I use this with Vue/Angular/etc?</strong></summary>

Yes! While LogoCN is optimized for React/Next.js component generation, it also saves standard SVG files that work in any framework. Simply skip the `init` step and use `add` to get SVG files directly.
</details>

<details>
<summary><strong>Logo not found?</strong></summary>

Try: `logocn search [partial-name]` to find the exact name, or `logocn update` to refresh the logo cache.
</details>

## Installation

While `npx logocn@latest` is recommended, you can also install globally:

```bash
# npm
npm install -g logocn

# pnpm  
pnpm add -g logocn

# yarn
yarn global add logocn
```

## License

MIT © [@5aikat](https://x.com/5aikat)

> **Note**: All logos are trademarks of their respective companies. Please ensure you have permission to use them in your project.

---

<sub>Logo source: [Simple Icons](https://simpleicons.org) • Inspired by [shadcn/ui](https://ui.shadcn.com)</sub>