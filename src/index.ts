#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import commands
import { handleAdd } from './commands/add.js';
import { handleList } from './commands/list.js';
import { handleSearch } from './commands/search.js';
import { handleConfig } from './commands/config.js';
import { handleInit } from './commands/init.js';
import { handleRemove } from './commands/remove.js';
import { displayCompactBanner } from './utils/banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
const { version } = packageJson;

const program = new Command();

// Main CLI setup
const setupCLI = (): void => {
  // Show compact banner for help, no command
  const showBanner = process.argv.length <= 2 || 
                     process.argv[2] === '--help' || 
                     process.argv[2] === '-h';
  
  // Don't show banner for init (it has its own premium banner)
  if (showBanner && process.argv[2] !== 'init') {
    displayCompactBanner();
  }

  program
    .name('logocn')
    .description('CLI tool to add SVG logos to your project')
    .version(version, '-v, --version')
    .usage('<command> [options]');

  // Init command - setup for optimal framework integration
  program
    .command('init')
    .description('Initialize LogoCN in your project')
    .option('-f, --force', 'Force initialization even if already initialized')
    .option('--skip-install', 'Skip installing dependencies')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .action(async (options) => {
      await handleInit(options);
    });

  // Add command - the primary command
  program
    .command('add')
    .description('Add logo(s) to your project (interactive mode if no logos specified)')
    .argument('[logos...]', 'Logo name(s) to add')
    .action(async (logos: string[] = []) => {
      await handleAdd(logos);
    });
  
  // Remove command
  program
    .command('remove')
    .alias('rm')
    .description('Remove logo(s) from your project')
    .argument('[logos...]', 'Logo name(s) to remove')
    .action(async (logos: string[] = []) => {
      await handleRemove(logos);
    });

  // List command
  program
    .command('list')
    .description('List all available logos')
    .option('-p, --page <number>', 'Page number for pagination')
    .option('-s, --search <query>', 'Search within list')
    .action(async (options) => {
      await handleList(options);
    });

  // Search command
  program
    .command('search')
    .description('Search for logos')
    .argument('<query>', 'Search query')
    .action(async (query: string) => {
      await handleSearch(query);
    });

  // Update command
  program
    .command('update')
    .description('Update the Simple Icons cache')
    .action(async () => {
      const { handleUpdate } = await import('./commands/update.js');
      await handleUpdate();
    });

  // Config command
  program
    .command('config')
    .description('Manage configuration')
    .option('-s, --set <key=value>', 'Set a configuration value')
    .option('-g, --get <key>', 'Get a configuration value')
    .option('-l, --list', 'List all configuration values')
    .option('-r, --reset', 'Reset to defaults')
    .action(async (options) => {
      await handleConfig(options);
    });

  // Add help examples
  program.addHelpText('after', `
${chalk.bold('Examples:')}
  $ logocn init                   ${chalk.gray('# Initialize LogoCN in your project')}
  $ logocn add apple              ${chalk.gray('# Add Apple logo')}
  $ logocn add react vue angular  ${chalk.gray('# Add multiple logos')}
  $ logocn list                   ${chalk.gray('# List all available logos')}
  $ logocn list --category tech   ${chalk.gray('# List logos in tech category')}
  $ logocn search social          ${chalk.gray('# Search for social media logos')}
  $ logocn config --set dir=./assets/logos  ${chalk.gray('# Set custom directory')}
  
${chalk.bold('Quick Start:')}
  $ npx logocn@latest init        ${chalk.gray('# Setup for your framework (recommended)')}
  $ npx logocn@latest add github  ${chalk.gray('# Add GitHub logo to your project')}
  
${chalk.bold('Workflow:')}
  ${chalk.cyan('1. logocn init')}              ${chalk.gray('# Setup project (optional but recommended)')}
  ${chalk.cyan('2. logocn add <logo>')}        ${chalk.gray('# Add logos to your project')}
  ${chalk.cyan('3. Import in your code')}      ${chalk.gray('# Use logos in your components')}
`);

  // Global error handler
  program.exitOverride();

  try {
    program.parse();
  } catch (err) {
    if (err instanceof Error) {
      console.error(chalk.red('Error:'), err.message);
    }
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(chalk.red('Uncaught Exception:'), err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

// Start the CLI
setupCLI();