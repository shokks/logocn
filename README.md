# logoCN

Add high-quality SVG logos to your project. Just like shadcn/ui, but for logos.

```bash
npx logocn@latest add tesla
```

[![npm version](https://img.shields.io/npm/v/logocn.svg)](https://www.npmjs.com/package/logocn)
[![Follow on X](https://img.shields.io/twitter/follow/5aikat?style=social)](https://x.com/5aikat)

## What is this?

**logoCN** lets you add any of 2,800+ company logos to your project with a single command. No packages to install. No dependencies. Just copy and paste.

- ✓ **SVG files** saved directly to your project
- ✓ **React components** with TypeScript support (optional)
- ✓ **Brand colors** included by default
- ✓ **Works everywhere** - Next.js, Vite, Vue, vanilla HTML

## Quick Start

```bash
npx logocn@latest add apple google microsoft
```

That's it. The logos are now in `components/logos/`.

### React Components (optional)

Want React components instead of just SVGs?

```bash
npx logocn@latest init   # One-time setup
npx logocn@latest add tesla
```

Now use them:

```jsx
import { TeslaLogo } from '@/components/logos'

<TeslaLogo size={48} />
```

## Usage

### Basic SVG

```jsx
import logo from './components/logos/github.svg'

<img src={logo} alt="GitHub" />
```

### React Component

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
npx logocn@latest init
npx logocn@latest add github twitter linkedin
```

```jsx
// app/page.tsx
import { GithubLogo, TwitterLogo, LinkedinLogo } from '@/components/logos'

export default function Home() {
  return (
    <footer className="flex gap-4">
      <GithubLogo size={20} />
      <TwitterLogo size={20} />
      <LinkedinLogo size={20} />
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

2,800+ logos from [Simple Icons](https://simpleicons.org) including:

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
```

#### `config`
```bash
logocn config --list                    # Show all settings
logocn config --get logoDirectory       # Get specific value
logocn config --set dir=./public/logos  # Change directory
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

Run `logocn init` once. This sets up automatic component generation. Then every logo you add gets both an SVG file and a `.tsx` component with TypeScript types and brand colors.
</details>

<details>
<summary><strong>What about logos starting with numbers?</strong></summary>

Logos like "1password" become `Lcn1passwordLogo` components (prefixed with "Lcn") to be valid JavaScript identifiers.
</details>

<details>
<summary><strong>Can I use this with Vue/Angular/etc?</strong></summary>

Yes! LogoCN saves standard SVG files that work everywhere. React component generation is optional.
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

---

<sub>Logo source: [Simple Icons](https://simpleicons.org) • Inspired by [shadcn/ui](https://ui.shadcn.com)</sub>