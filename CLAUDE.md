# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LogoCN is a fully implemented CLI tool that adds SVG logos to your project with a single command. Like shadcn/ui, but for icons. It provides instant access to 2,800+ high-quality logos from Simple Icons with zero configuration required.

## Core Commands for Development

```bash
# Development (uses tsx for hot reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run built version
npm start

# Clean build directory
npm run clean

# Release & Version Management
npm run release:beta    # Beta release (0.1.0-beta.1)
npm run release:patch   # Patch release (0.1.0 → 0.1.1)
npm run release:minor   # Minor release (0.1.0 → 0.2.0)
npm run release:major   # Major release (0.1.0 → 1.0.0)

# Changelog generation (automatic on version bump)
npm run changelog       # Manually generate changelog from commits
```

## Architecture & Key Files

### Project Structure
- **`src/index.ts`**: Main CLI entry point using Commander.js, sets up all commands and global error handling
- **`src/commands/`**: Command handlers directory - each command is a separate module
  - `init.ts` - Initialize project configuration with framework detection
  - `add.ts` - Add logos to project (interactive if no args)
  - `remove.ts` - Remove logos from project
  - `list.ts` - Display available logos with pagination
  - `search.ts` - Search logos by name with smart matching
  - `config.ts` - Manage configuration settings
  - `uninstall.ts` - Clean up LogoCN files from project
- **`src/utils/`**: Utility modules
  - `cache.ts` - Cache manager for Simple Icons metadata (7-day expiration)
  - `registry.ts` - Logo registry with CDN integration
  - `banner.ts` - Premium ASCII art with gradient effects
  - `exportGenerator.ts` - Generate index.tsx for React components
  - `framework.ts` - Detect project framework (Next.js, Vite, CRA)
- **`logocn.config.json`**: Project-specific configuration (created on init)
- **`~/.logocn/cache/`**: User cache directory for offline support

### Command Pattern
Commands follow this pattern:
1. Create handler in `src/commands/[command].ts`
2. Export async function `handle[Command]`
3. Import and register in `src/index.ts` using Commander.js

### TypeScript Configuration
- ES2022 target with ESNext modules
- Strict mode enabled
- Source maps and declarations generated
- Output to `dist/` directory

### Logo Management
- **Source**: Simple Icons CDN (cdn.jsdelivr.net)
- **Cache**: 7-day local cache in ~/.logocn/cache
- **Search**: Priority-based (exact match → prefix → substring)
- **Components**: Auto-generated React components with TypeScript
- **Naming**: Logos starting with numbers get "Lcn" prefix (e.g., 4chan → Lcn4chanLogo)

## Current Features

### CLI Commands
- **`logocn init`** - Initialize configuration with framework detection
- **`logocn add [logos...]`** - Add logos (interactive mode if no args)
- **`logocn remove [logos...]`** - Remove logos from project
- **`logocn list`** - Display all 2,800+ available logos with pagination
- **`logocn search <query>`** - Smart search with fuzzy matching
- **`logocn config`** - View/update configuration settings
- **`logocn uninstall`** - Clean up LogoCN files from project

### Key Features
- **2,800+ Logos**: Full Simple Icons library available
- **React Components**: Auto-generated with TypeScript support
- **Brand Colors**: Included as default props in components
- **Framework Detection**: Automatic for Next.js, Vite, Create React App
- **Smart Search**: Priority-based matching (exact → prefix → substring)
- **Offline Support**: 7-day cache for metadata
- **Batch Operations**: Add/remove multiple logos at once
- **Interactive Mode**: Browse and select logos interactively
- **Premium ASCII Art**: Gradient banner on initialization
- **Zero Config**: Works out of the box with smart defaults

## Dependencies

**Production:**
- `commander`: CLI framework and command parsing
- `chalk`: Terminal colors and styling
- `inquirer`: Interactive prompts and selection
- `ora`: Progress spinners for async operations
- `figlet`: ASCII art generation
- `fs-extra`: Enhanced file system operations
- `node-fetch`: HTTP requests for CDN downloads

**Development:**
- `typescript`: TypeScript compiler
- `tsx`: TypeScript execution for development
- `auto-changelog`: Automatic changelog generation
- Type definitions for all dependencies

## Important Notes

### Component Naming
- Logos starting with numbers get "Lcn" prefix to avoid JavaScript syntax errors
- Example: `4chan.svg` → `Lcn4chanLogo` component

### File Locations
- **Config**: `logocn.config.json` in project root
- **Cache**: `~/.logocn/cache/` (7-day expiration)
- **Logos**: Configurable, default `components/logos/`
- **Index**: Auto-generated `index.tsx` for imports

### Publishing Information
- **Package**: `logocn` on npm
- **Author**: @5aikat
- **Repository**: github.com/shokks/logocn
- **License**: MIT
- **Version**: Semantic versioning with auto-changelog

### Contributing
- Pull requests welcome
- See CONTRIBUTING.md for guidelines
- Run tests with `npm run build && npm link`
- Follow existing code patterns and TypeScript conventions