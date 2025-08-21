# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LogoCN is a CLI tool for adding SVG logos to projects, similar to how shadcn/ui works for components. The project is currently a TypeScript CLI template that needs to be transformed into the LogoCN tool as described in `docs/mvp.md`.

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
```

## Architecture & Key Files

### Project Structure
- **`src/index.ts`**: Main CLI entry point using Commander.js, sets up all commands and global error handling
- **`src/commands/`**: Command handlers directory - each command is a separate module
- **`config.json`**: Stores CLI configuration (created at runtime)

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

## MVP Requirements (from docs/mvp.md)

The CLI needs to be transformed to support:
- `logocn add [logo-name]` - Download SVG logos to project
- `logocn list` - Show available logos
- `logocn search [query]` - Search logos by category/name
- `logocn config` - Set custom directory (default: `components/logos`)

Key implementation needs:
- Logo registry (JSON mapping names to SVG URLs)
- SVG download and file management
- GitHub repository integration for logo storage
- Framework-agnostic SVG file copying

## Dependencies

**Production:**
- `commander`: CLI framework
- `chalk`: Terminal colors
- `inquirer`: Interactive prompts
- `ora`: Progress spinners
- `figlet`: ASCII art

**Development:**
- `typescript`: Compiler
- `tsx`: TypeScript execution for development
- Type definitions for all dependencies