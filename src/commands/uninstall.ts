import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import ora from 'ora';

export async function handleUninstall(options: { yes?: boolean; keepLogos?: boolean }) {
  console.log(chalk.yellow('\n🗑️  LogoCN Uninstall Cleanup\n'));

  const projectPath = process.cwd();
  const configPath = path.join(projectPath, 'logocn.config.json');
  const globalCachePath = path.join(os.homedir(), '.logocn');
  
  // Check what exists
  const hasConfig = await fs.pathExists(configPath);
  const hasGlobalCache = await fs.pathExists(globalCachePath);
  
  let logoPath: string | null = null;
  let hasLogos = false;

  if (hasConfig) {
    try {
      const config = await fs.readJson(configPath);
      logoPath = path.join(projectPath, config.logoDirectory || 'components/logos');
      hasLogos = await fs.pathExists(logoPath);
    } catch {
      // Config might be corrupted, ignore
    }
  }

  // Show what will be cleaned
  console.log(chalk.cyan('Found the following LogoCN files:\n'));
  
  if (hasConfig) {
    console.log(chalk.gray('  • Project config: ') + chalk.white('logocn.config.json'));
  }
  
  if (hasLogos && logoPath && !options.keepLogos) {
    const logoFiles = await fs.readdir(logoPath);
    const svgCount = logoFiles.filter(f => f.endsWith('.svg')).length;
    const tsxCount = logoFiles.filter(f => f.endsWith('.tsx')).length;
    
    if (svgCount > 0 || tsxCount > 0) {
      console.log(chalk.gray('  • Logo files: ') + chalk.white(`${logoPath} (${svgCount} SVGs, ${tsxCount} components)`));
    }
  }
  
  if (hasGlobalCache) {
    console.log(chalk.gray('  • Global cache: ') + chalk.white('~/.logocn/'));
  }

  if (!hasConfig && !hasLogos && !hasGlobalCache) {
    console.log(chalk.green('✨ No LogoCN files found in this project!\n'));
    console.log(chalk.gray('To uninstall LogoCN globally, run:'));
    console.log(chalk.cyan('  npm uninstall -g logocn\n'));
    return;
  }

  console.log();

  // Confirm cleanup
  if (!options.yes) {
    const { confirmCleanup } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmCleanup',
        message: options.keepLogos 
          ? 'Remove LogoCN configuration (keeping logo files)?'
          : 'Remove all LogoCN files from this project?',
        default: true
      }
    ]);

    if (!confirmCleanup) {
      console.log(chalk.gray('\n✖ Cleanup cancelled\n'));
      return;
    }
  }

  const spinner = ora('Cleaning up LogoCN files...').start();

  try {
    // Remove config
    if (hasConfig) {
      await fs.remove(configPath);
      spinner.succeed('Removed logocn.config.json');
    }

    // Remove logos (unless --keep-logos flag is set)
    if (hasLogos && logoPath && !options.keepLogos) {
      await fs.remove(logoPath);
      spinner.succeed(`Removed logo directory: ${logoPath}`);
    } else if (options.keepLogos && hasLogos) {
      spinner.info(`Kept logo files in: ${logoPath}`);
    }

    // Ask about global cache
    if (hasGlobalCache) {
      spinner.stop();
      
      if (!options.yes) {
        const { removeCache } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'removeCache',
            message: 'Also remove global cache (~/.logocn)?',
            default: false
          }
        ]);

        if (removeCache) {
          const cacheSpinner = ora('Removing global cache...').start();
          await fs.remove(globalCachePath);
          cacheSpinner.succeed('Removed global cache');
        }
      }
    }

    console.log(chalk.green('\n✨ LogoCN cleanup complete!\n'));
    
    // Show global uninstall instructions
    console.log(chalk.gray('To uninstall LogoCN globally, run:'));
    console.log(chalk.cyan('  npm uninstall -g logocn\n'));
    
  } catch (error) {
    spinner.fail('Cleanup failed');
    console.error(chalk.red(`\n✖ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`));
    process.exit(1);
  }
}