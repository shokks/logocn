# LogoCN - SVG Logo Component Library CLI

Target domain: logocn.dev

## Implementation Status

✅ **MVP Complete** - The core functionality is fully implemented and operational.

## Project Overview

A CLI tool called **LogoCN** that allows developers to instantly add SVG logos to their projects via command line, similar to how shadcn/ui works for components.

## Core Functionality

**Installation command:**

```
npx logocn@latest add apple
```

This downloads the Apple logo SVG and places it in `components/logos/apple.svg`

**Available commands:**

- `logocn init` - Initialize project configuration with framework detection
- `logocn add [logos...]` - Add logos (interactive mode if no arguments provided)
- `logocn add apple google microsoft` - Install multiple logos at once
- `logocn remove [logos...]` - Remove logos from your project
- `logocn list [--category <name>]` - Show all available logos (optionally filtered)
- `logocn search <query>` - Search available logos by name/tags/category
- `logocn config [options]` - Manage configuration settings

## Technical Architecture

**1. CLI Tool**

- Node.js-based CLI using Commander.js
- Published to npm for use with npx/bunx/pnpx
- TypeScript for better maintainability

**2. Logo Registry**

- JSON registry file mapping logo names to SVG URLs
- Hosted on GitHub repository
- Categories and metadata for each logo (tech, social, finance, etc.)

**3. SVG Source**

- Leverages Simple Icons CDN for 2,800+ optimized SVG logos
- No need to maintain own SVG repository
- Direct downloads from jsdelivr CDN
- Consistent sizing and formatting guaranteed

## Key Features

- **Zero configuration** - Works out of the box
- **Framework agnostic** - Just copies SVG files, works with any framework
- **Optimized SVGs** - Pre-optimized for web use
- **Version control friendly** - Simple SVG files that can be committed
- **Customizable** - Users can specify target directory
- **Fast** - Direct file download, no build process

## Success Criteria

- Developer can install any logo in under 5 seconds
- Support for 100+ common brand/company logos at launch
- Works seamlessly with React, Next.js, Vue, etc.
- Simple enough that junior developers can use it immediately

## Additional Features Implemented

Beyond the original MVP requirements, the following features have been added:

- **Zero-config mode** - Smart defaults with framework detection
- **Interactive selection** - Browse and select logos interactively
- **Fuzzy search** - Intelligent matching for logo names
- **Export file generation** - Auto-generated index files for easy imports
- **Framework detection** - Automatic detection of React, Vue, Next.js, etc.
- **Remove command** - Manage and remove logos from your project
- **Batch operations** - Progress indicators for multiple logo downloads
- **Auto-complete support** - Fuzzy matching for typos and variations

## Inspiration

Follows the shadcn/ui philosophy: "Copy and paste, not a dependency." Logos become part of the user's codebase, not an external package.