# LogoCN

A powerful and feature-rich CLI tool built with Commander.js and TypeScript.

## Features

- 🎨 Beautiful colored output with chalk
- 📝 Interactive prompts with inquirer
- ⚙️ Configuration management
- 🔄 File processing with multiple formats
- 📊 Progress indicators with ora
- 🎯 TypeScript support
- 🚀 Modern ES modules

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run the CLI:
   ```bash
   # Development mode (with tsx)
   npm run dev
   
   # Production mode
   npm start
   ```

### Global Installation

After building, you can install globally:

```bash
npm link
```

Then use from anywhere:
```bash
logocn --help
```

## Usage

### Basic Commands

```bash
# Show help
logocn --help

# Show version
logocn --version

# Enable debug mode
logocn --debug
```

### Greet Command

Interactive greeting with customizable options:

```bash
# Interactive greeting
logocn greet

# Greet with name
logocn greet "John Doe"

# Formal greeting
logocn greet --formal

# Custom color
logocn greet --color blue

# Combine options
logocn greet "Alice" --formal --color magenta
```

### Config Command

Manage CLI configuration:

```bash
# List all configuration
logocn config --list

# Get specific config value
logocn config --get theme

# Set configuration value
logocn config --set theme=dark

# Reset to defaults
logocn config --reset

# Show help
logocn config
```

### Process Command

Process files or data with different formats:

```bash
# Process raw data
logocn process "Hello World"

# Process file
logocn process data.json

# Output to file
logocn process input.txt --output result.json

# Different format
logocn process data.csv --format json

# Verbose output
logocn process file.txt --verbose

# Combine options
logocn process data.json --output result.csv --format csv --verbose
```

## Configuration

The CLI stores configuration in `config.json` with these default values:

```json
{
  "theme": "default",
  "defaultFormat": "json",
  "autoSave": true,
  "lastUsed": "2024-01-01T00:00:00.000Z"
}
```

## Development

### Project Structure

```
src/
├── index.ts          # Main CLI entry point
├── commands/         # Command handlers
│   ├── greet.ts      # Greet command
│   ├── config.ts     # Config command
│   └── process.ts    # Process command
└── utils/            # Utility functions (future)
```

### Available Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Run in development mode with tsx
- `npm start` - Run built version
- `npm run clean` - Clean dist folder

### Adding New Commands

1. Create a new command file in `src/commands/`
2. Export a handler function
3. Import and register in `src/index.ts`

Example:
```typescript
// src/commands/example.ts
export const handleExample = async (options: any): Promise<void> => {
  // Command logic here
};

// src/index.ts
import { handleExample } from './commands/example.js';

program
  .command('example')
  .description('Example command')
  .action(handleExample);
```

## Dependencies

### Production
- `commander` - CLI framework
- `chalk` - Terminal colors
- `inquirer` - Interactive prompts
- `ora` - Progress spinners
- `figlet` - ASCII art

### Development
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution
- `@types/*` - Type definitions

## License

MIT License - feel free to use this project for your own CLI tools!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Examples

### Interactive Session
```bash
$ logocn greet
? What is your name? John
? How are you feeling today? Great!
Hello John! I hope you're feeling great!.
Greeted at 2:30:45 PM
```

### File Processing
```bash
$ logocn process sample.json --format csv --output result.csv --verbose
⠋ Processing data...
⠙ Reading file: sample.json
✓ Processing completed!
✓ Output saved to: result.csv

Metadata:
──────────
size       : 1024
type       : file
format     : csv
```

### Configuration Management
```bash
$ logocn config --list
Current Configuration:
──────────────────────────────────────────────────
theme          : default
defaultFormat  : json
autoSave       : true
lastUsed       : 2024-01-01T12:00:00.000Z
```
