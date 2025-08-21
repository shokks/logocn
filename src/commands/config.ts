import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { loadConfig, saveConfig, resetConfig } from '../utils/config.js';
import { Config } from '../types/index.js';

interface ConfigOptions {
  set?: string;
  get?: string;
  list?: boolean;
  reset?: boolean;
}

/**
 * Handle the config command - manage LogoCN configuration
 */
export async function handleConfig(options: ConfigOptions): Promise<void> {
  try {
    const config = await loadConfig();
    
    // Reset configuration to defaults
    if (options.reset) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Reset all configuration to defaults?',
        default: false
      }]);
      
      if (confirm) {
        await resetConfig();
        console.log(chalk.green('✓ Configuration reset to defaults'));
        console.log(chalk.gray('  Logo directory: components/logos'));
        console.log(chalk.gray('  Use color: true'));
      }
      return;
    }
    
    // Get specific configuration value
    if (options.get) {
      const key = options.get as keyof Config;
      const value = config[key];
      
      if (value !== undefined) {
        console.log(value);
      } else {
        console.error(chalk.red(`Unknown configuration key: ${options.get}`));
        console.log(chalk.gray('Available keys: logoDirectory, useColor'));
        process.exit(1);
      }
      return;
    }
    
    // Set configuration value
    if (options.set) {
      const [key, ...valueParts] = options.set.split('=');
      const value = valueParts.join('='); // Handle values with = in them
      
      if (!key || !value) {
        console.error(chalk.red('✗ Invalid format. Use: --set key=value'));
        console.log(chalk.gray('  Example: logocn config --set logoDirectory=./assets/logos'));
        process.exit(1);
      }
      
      // Handle different configuration keys
      if (key === 'logoDirectory' || key === 'dir') {
        // Normalize the path (remove trailing slash, etc.)
        const normalizedPath = path.normalize(value).replace(/\\/g, '/');
        config.logoDirectory = normalizedPath;
        await saveConfig(config);
        console.log(chalk.green(`✓ Logo directory set to: ${normalizedPath}`));
        
        // Show the full path for clarity
        const fullPath = path.join(process.cwd(), normalizedPath);
        console.log(chalk.gray(`  Full path: ${fullPath}`));
      } else if (key === 'useColor' || key === 'color') {
        config.useColor = value.toLowerCase() === 'true';
        await saveConfig(config);
        console.log(chalk.green(`✓ Use color set to: ${config.useColor}`));
      } else {
        console.error(chalk.red(`✗ Unknown configuration key: ${key}`));
        console.log(chalk.gray('Available keys:'));
        console.log(chalk.gray('  • logoDirectory (or dir) - Where to save logos'));
        console.log(chalk.gray('  • useColor (or color) - Use colored output (true/false)'));
        process.exit(1);
      }
      return;
    }
    
    // List all configuration (default action)
    if (options.list || (!options.set && !options.get && !options.reset)) {
      console.log();
      console.log(chalk.cyan.bold('⚙️  LogoCN Configuration'));
      console.log(chalk.gray('─'.repeat(50)));
      
      console.log(chalk.cyan('Logo Directory:'));
      console.log(`  ${config.logoDirectory}`);
      const fullPath = path.join(process.cwd(), config.logoDirectory);
      console.log(chalk.gray(`  Full path: ${fullPath}`));
      
      console.log();
      console.log(chalk.cyan('Use Color Output:'));
      console.log(`  ${config.useColor ? chalk.green('true') : chalk.red('false')}`);
      
      if (config.registry) {
        console.log();
        console.log(chalk.cyan('Custom Registry:'));
        console.log(`  ${config.registry}`);
      }
      
      console.log();
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.dim('Usage:'));
      console.log(chalk.dim('  Set directory:  logocn config --set dir=./assets/logos'));
      console.log(chalk.dim('  Get value:      logocn config --get logoDirectory'));
      console.log(chalk.dim('  Reset:          logocn config --reset'));
      return;
    }
    
  } catch (error: any) {
    console.error(chalk.red('Config error:'), error.message);
    process.exit(1);
  }
}

export { handleConfig as default };