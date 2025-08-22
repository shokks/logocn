import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { getOrCreateProjectConfig, isZeroConfigMode } from '../utils/autoDetect.js';
import { generateExportFile } from '../utils/exportGenerator.js';

/**
 * Handle the remove command - remove logo(s) from the project
 */
export async function handleRemove(logos: string[]): Promise<void> {
  // If no logos specified, enter interactive mode
  if (!logos || logos.length === 0) {
    await handleInteractiveRemove();
    return;
  }

  const spinner = ora('Checking project configuration...').start();
  
  try {
    // Use smart defaults in zero-config mode
    const config = await getOrCreateProjectConfig();
    const logoDir = config.logoDirectory;
    
    // Show zero-config notice
    if (await isZeroConfigMode()) {
      spinner.info(chalk.cyan('Running in zero-config mode.'));
      spinner.start();
    }
    
    spinner.text = 'Removing logos...';
    
    const results: { success: boolean; logoName: string; error?: string }[] = [];
    
    // Process each logo
    for (const logoName of logos) {
      const normalizedName = logoName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Check for various file extensions
      const possibleFiles = [
        `${normalizedName}.svg`,
        `${logoName}.svg`,
        `${normalizedName}.tsx`,
        `${normalizedName}.jsx`,
        `${logoName}.tsx`,
        `${logoName}.jsx`
      ];
      
      let removed = false;
      for (const file of possibleFiles) {
        const filePath = path.join(logoDir, file);
        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath);
          removed = true;
        }
      }
      
      if (removed) {
        results.push({
          success: true,
          logoName
        });
      } else {
        results.push({
          success: false,
          logoName,
          error: 'Logo not found'
        });
      }
    }
    
    spinner.stop();
    
    // Always regenerate export file after remove operations
    // This ensures the index.tsx is updated even if all logos are removed
    const successful = results.filter(r => r.success);
    if (successful.length > 0) {
      const exportSpinner = ora('Updating index file...').start();
      try {
        await generateExportFile();
        exportSpinner.succeed('Updated index file');
      } catch (error: any) {
        exportSpinner.fail('Failed to update index file');
        console.error(chalk.yellow('Warning:'), error.message);
        console.log(chalk.gray('You may need to manually update the index file.'));
      }
    }
    
    // Display results
    displayResults(results, logoDir);
    
  } catch (error: any) {
    spinner.fail('Failed to remove logos');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Handle interactive remove mode
 */
async function handleInteractiveRemove(): Promise<void> {
  try {
    // Use smart defaults in zero-config mode
    const config = await getOrCreateProjectConfig();
    const logoDir = config.logoDirectory;
    
    // Get all existing logos
    if (!(await fs.pathExists(logoDir))) {
      console.log(chalk.yellow('No logos directory found. Nothing to remove.'));
      return;
    }
    
    const files = await fs.readdir(logoDir);
    const svgFiles = files.filter(f => f.endsWith('.svg'));
    
    if (svgFiles.length === 0) {
      console.log(chalk.yellow('No logos found to remove.'));
      return;
    }
    
    console.log(chalk.cyan.bold('\n🗑️  Remove Logos\n'));
    
    const { logos } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'logos',
        message: 'Select logos to remove:',
        choices: svgFiles.map(file => ({
          name: file.replace('.svg', ''),
          value: file.replace('.svg', '')
        })),
        validate: (answer) => answer.length > 0 || 'Please select at least one logo to remove'
      }
    ]);
    
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to remove ${logos.length} logo(s)?`,
        default: false
      }
    ]);
    
    if (confirm) {
      await handleRemove(logos);
    } else {
      console.log(chalk.gray('Removal cancelled.'));
    }
    
  } catch (error: any) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Display the results of the remove operation
 */
function displayResults(results: any[], logoDir: string): void {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(); // Empty line for spacing
  
  if (successful.length > 0) {
    console.log(chalk.green.bold(`✓ Successfully removed ${successful.length} logo${successful.length > 1 ? 's' : ''}:`));
    successful.forEach(result => {
      console.log(chalk.gray(`  • ${result.logoName}`));
    });
  }
  
  if (failed.length > 0) {
    console.log(); // Empty line for spacing
    console.log(chalk.yellow.bold(`⚠ Failed to remove ${failed.length} logo${failed.length > 1 ? 's' : ''}:`));
    failed.forEach(result => {
      console.log(chalk.gray(`  • ${result.logoName}: ${result.error}`));
    });
  }
}