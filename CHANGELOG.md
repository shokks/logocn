# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of LogoCN
- `logocn add [logo]` command to add logos to your project
- `logocn list` command to show all available logos
- `logocn search [query]` command to search logos
- `logocn init` command to initialize configuration
- `logocn config` command to manage settings
- Support for 2,800+ logos from Simple Icons
- Automatic React component generation with TypeScript support
- Brand colors included as default props
- Offline support with 7-day cache
- Framework detection (Next.js, Vite, Create React App)
- Smart search with exact, prefix, and substring matching
- Premium ASCII art banner on initialization

### Security
- Safe component naming for logos starting with numbers (Lcn prefix)

## [0.1.0] - 2024-01-XX
- Initial beta release

[Unreleased]: https://github.com/shokks/logocn/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/shokks/logocn/releases/tag/v0.1.0