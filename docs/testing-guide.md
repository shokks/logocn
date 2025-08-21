# LogoCN Testing Guide

This guide explains how to test LogoCN locally with your projects before publishing to npm.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Testing with npm link](#local-testing-with-npm-link)
- [Testing with Next.js](#testing-with-nextjs)
- [Testing with Other Frameworks](#testing-with-other-frameworks)
- [Alternative Testing Methods](#alternative-testing-methods)
- [Test Scenarios](#test-scenarios)
- [Troubleshooting](#troubleshooting)
- [Cleanup](#cleanup)

## Prerequisites

Before testing LogoCN locally, ensure you have:
- Node.js 16+ installed
- npm or yarn package manager
- A test project (Next.js, React, Vue, or plain HTML)
- LogoCN built and ready (`npm run build`)

## Local Testing with npm link

The recommended way to test LogoCN locally is using npm link, which creates a symbolic link to your local package.

### Step 1: Prepare LogoCN

```bash
# Navigate to LogoCN directory
cd /path/to/logocn

# Install dependencies (if not already done)
npm install

# Build the project
npm run build

# Create a global link
npm link
```

You should see a message like:
```
/usr/local/lib/node_modules/logocn -> /path/to/logocn
```

### Step 2: Link to Your Test Project

```bash
# Navigate to your test project
cd /path/to/your-test-project

# Link to the local LogoCN
npm link logocn
```

### Step 3: Verify Installation

```bash
# Test that LogoCN is available
npx logocn --version
npx logocn --help
```

## Testing with Next.js

### Create a Test Next.js Project

```bash
# Create new Next.js app (optional)
npx create-next-app@latest test-logocn-nextjs
cd test-logocn-nextjs

# Link LogoCN
npm link logocn
```

### Test Basic Commands

```bash
# Initialize LogoCN (recommended first step)
npx logocn init

# List available logos
npx logocn list

# Search for specific logos
npx logocn search "react"
npx logocn search "database"

# Add logos (will use project config if initialized)
npx logocn add react nextdotjs vercel

# Check the files were created
ls -la components/logos/
```

### Configure Custom Directory

```bash
# Set custom directory for Next.js public folder
npx logocn config --set dir=public/logos

# Add more logos to the new location
npx logocn add github typescript tailwindcss

# Verify files in public directory
ls -la public/logos/
```

### Use Logos in Next.js Components

#### Method 1: Barrel Exports (Recommended)
```jsx
// app/page.tsx
import { logos } from '@/lib/logos'

export default function Home() {
  return (
    <div>
      <img src={logos.react} alt="React" width="100" height="100" />
      <img src={logos.nextdotjs} alt="Next.js" width="100" height="100" />
      <img src={logos.vercel} alt="Vercel" width="100" height="100" />
    </div>
  )
}
```

#### Method 2: Individual SVG Imports
```jsx
// app/page.tsx
import ReactLogo from '@/components/logos/react.svg'
import NextLogo from '@/components/logos/nextdotjs.svg'

export default function Home() {
  return (
    <div>
      <ReactLogo width={100} height={100} />
      <NextLogo width={100} height={100} />
    </div>
  )
}
```

#### Method 3: With Next.js Image Component
```jsx
// app/page.tsx
import Image from 'next/image'
import { logos } from '@/lib/logos'

export default function Home() {
  return (
    <div>
      <Image src={logos.react} alt="React" width={100} height={100} />
    </div>
  )
}
```

#### Method 4: Direct URL (for logos in public folder)
```jsx
// app/page.tsx
export default function Home() {
  return (
    <div>
      <img src="/logos/github.svg" alt="GitHub" width="100" height="100" />
    </div>
  )
}
```

### Required Next.js Configuration

For SVG imports, you might need to configure Next.js. Create or update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  }
}

module.exports = nextConfig
```

And install the required package:
```bash
npm install --save-dev @svgr/webpack
```

## Testing with Other Frameworks

### React (Create React App)

```bash
# In your React project
npm link logocn

# Initialize LogoCN for React
npx logocn init

# Add logos
npx logocn add react javascript css3

# Use barrel exports (recommended)
# src/App.js
import { logos } from './lib/logos';

function App() {
  return (
    <div>
      <img src={logos.react} alt="React" />
      <img src={logos.javascript} alt="JavaScript" />
    </div>
  );
}

# Or individual imports
import ReactLogo from './components/logos/react.svg';
```

### Vue.js

```bash
# In your Vue project
npm link logocn

# Initialize LogoCN for Vue
npx logocn init

# Add logos
npx logocn add vuedotjs javascript nodejs

# Use barrel exports (recommended)
# In your Vue component
import { logos } from '@/lib/logos'

export default {
  template: `
    <div>
      <img :src="logos.vuedotjs" alt="Vue.js" />
      <img :src="logos.javascript" alt="JavaScript" />
    </div>
  `
}

# Or direct path references
# <img src="@/components/logos/vuedotjs.svg" alt="Vue">
```

### Vanilla HTML/CSS/JS

```bash
# In your project directory
npm link logocn

# Initialize LogoCN for vanilla projects
npx logocn init

# Add logos
npx logocn add html5 css3 javascript

# Use barrel exports in JavaScript (if using modules)
# main.js
import { logos } from './lib/logos.js'

document.body.innerHTML = `
  <img src="${logos.html5}" alt="HTML5" />
  <img src="${logos.css3}" alt="CSS3" />
  <img src="${logos.javascript}" alt="JavaScript" />
`

# Or direct HTML references
# <img src="assets/logos/html5.svg" alt="HTML5">
```

## Alternative Testing Methods

### Method 1: Direct Execution (Without npm link)

```bash
# Build LogoCN
cd /path/to/logocn
npm run build

# Run directly from any project
cd /path/to/your-project
node /path/to/logocn/dist/index.js add react
```

### Method 2: Using npm pack

```bash
# In LogoCN directory
npm pack
# Creates logocn-0.1.0.tgz

# In test project
npm install /path/to/logocn-0.1.0.tgz

# Use normally
npx logocn add react
```

### Method 3: Development Mode

```bash
# Run LogoCN in development mode from source
cd /path/to/logocn
npm run dev -- add react

# Or from any directory
cd /your/project
npm run --prefix /path/to/logocn dev -- add react
```

## Test Scenarios

### Essential Test Cases

1. **Initialization**
   ```bash
   npx logocn init
   # Expected: Creates logocn.config.json, framework-specific config files, and lib directory
   ```

2. **Basic Add Operation**
   ```bash
   npx logocn add react
   # Expected: react.svg created in configured directory and lib/logos.ts updated
   ```

3. **Multiple Logos**
   ```bash
   npx logocn add github gitlab bitbucket
   # Expected: All three SVG files created and export file updated with all logos
   ```

4. **List Command**
   ```bash
   npx logocn list
   # Expected: Display all available logos grouped by category
   ```

5. **Category Filter**
   ```bash
   npx logocn list --category development
   # Expected: Only show development category logos
   ```

6. **Search Function**
   ```bash
   npx logocn search "database"
   # Expected: Show all database-related logos
   ```

7. **Configuration**
   ```bash
   npx logocn config --set dir=./custom/path
   npx logocn config --get dir
   # Expected: Shows ./custom/path
   ```

8. **Duplicate File Handling**
   ```bash
   npx logocn add react
   npx logocn add react  # Run again
   # Expected: Warning about existing file, export file still updated
   ```

9. **Invalid Logo Name**
   ```bash
   npx logocn add nonexistentlogo123
   # Expected: Error message with search suggestion
   ```

10. **Mixed Valid/Invalid**
    ```bash
    npx logocn add react invalidlogo github
    # Expected: Success for react and github, error for invalidlogo, export file updated with valid logos
    ```

11. **Reset Configuration**
    ```bash
    npx logocn config --reset
    # Expected: Confirmation prompt, then reset to defaults
    ```

12. **Export File Generation**
    ```bash
    npx logocn add react vue
    cat lib/logos.ts  # or lib/logos.js
    # Expected: See barrel export with logos map and TypeScript types
    ```

### Edge Cases

- **Special Characters in Names**
  ```bash
  npx logocn add "react" "vue.js" "node-js"
  ```

- **Case Sensitivity**
  ```bash
  npx logocn add React GITHUB VueJS
  ```

- **Aliases**
  ```bash
  npx logocn add nodejs node vue vuejs
  ```

## Troubleshooting

### Common Issues and Solutions

#### "Command not found: logocn"
- Ensure npm link was successful
- Try using `npx logocn` instead of just `logocn`
- Check npm global path: `npm config get prefix`

#### "Cannot find module" errors
- Rebuild LogoCN: `npm run build`
- Re-link: `npm unlink` then `npm link` again
- Check Node.js version compatibility

#### SVGs not downloading
- Check internet connection
- Verify Simple Icons CDN is accessible
- Try with a known working logo like "react"

#### Permission denied errors
- Check write permissions for target directory
- Use `sudo` if necessary (not recommended)
- Change to a writable directory

#### SVG import errors in framework
- Install necessary webpack loaders (@svgr/webpack for React/Next.js)
- Configure webpack to handle SVG files
- Use public folder approach as alternative

### Debug Mode

For more detailed output during testing:

```bash
# Set NODE_ENV to development
NODE_ENV=development npx logocn add react

# Or use verbose npm logging
npm_config_loglevel=verbose npx logocn add react
```

## Cleanup

### Remove npm link from Test Project

```bash
# In your test project
npm unlink logocn

# Verify removal
npm list logocn  # Should show "empty"
```

### Remove Global npm link

```bash
# In LogoCN directory
npm unlink

# Verify removal
npm list -g logocn  # Should not show logocn
```

### Clean Test Files

```bash
# Remove downloaded logos
rm -rf components/logos
rm -rf public/logos
# Or wherever you configured them

# Reset LogoCN configuration
rm -rf ~/.logocn
```

## Continuous Testing

For development workflow:

```bash
# Watch mode for TypeScript changes
cd /path/to/logocn
npm run build -- --watch

# In another terminal, test changes immediately
cd /path/to/test-project
npx logocn add react
```

## Testing Checklist

Before considering LogoCN ready:

- [ ] All commands work without errors
- [ ] Logos download successfully
- [ ] Configuration persists between sessions
- [ ] Search returns relevant results
- [ ] List displays all categories properly
- [ ] Works with Next.js projects
- [ ] Works with React projects  
- [ ] Works with Vue.js projects
- [ ] Works with plain HTML projects
- [ ] Export file generation works correctly
- [ ] Barrel exports provide proper TypeScript types
- [ ] Individual imports work in all frameworks
- [ ] Handles errors gracefully
- [ ] Help text is clear and accurate
- [ ] File paths work on Windows/Mac/Linux
- [ ] Init command creates proper directory structure
- [ ] Multiple import styles work as expected

## Publishing After Testing

Once all tests pass:

1. Update version in package.json
2. Build final version: `npm run build`
3. Test one more time with `npm pack`
4. Publish: `npm publish`
5. Test with: `npx logocn@latest add react`

## Getting Help

If you encounter issues during testing:

1. Check this guide's troubleshooting section
2. Review the [implementation plan](./implementation-plan.md)
3. Check for existing issues on GitHub
4. Create a new issue with:
   - Your environment (OS, Node version)
   - Steps to reproduce
   - Error messages
   - Expected vs actual behavior