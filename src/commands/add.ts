import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { SimpleIconsService } from '../services/simpleIcons.js';
import { RegistryManager } from '../utils/registry.js';
import { FileManager } from '../utils/fileManager.js';
import { getLogoDirectory } from '../utils/config.js';
import { getEffectiveLogoDirectory } from '../utils/frameworks.js';
import { generateExportFile } from '../utils/exportGenerator.js';
import { DownloadResult } from '../types/index.js';
import { getOrCreateProjectConfig, isZeroConfigMode } from '../utils/autoDetect.js';

/**
 * Handle the add command - download and save logo(s) to the project
 */
export async function handleAdd(logos: string[]): Promise<void> {
  // If no logos specified, enter interactive mode
  if (!logos || logos.length === 0) {
    await handleInteractiveAdd();
    return;
  }

  const spinner = ora('Loading logo registry...').start();
  
  try {
    // Initialize services
    const registry = new RegistryManager();
    
    const simpleIcons = new SimpleIconsService();
    const fileManager = new FileManager();
    
    // Use smart defaults in zero-config mode
    const config = await getOrCreateProjectConfig();
    const logoDir = config.logoDirectory;
    
    // Show zero-config notice
    if (await isZeroConfigMode()) {
      spinner.info(chalk.cyan('Running in zero-config mode. Run "logocn init" to customize settings.'));
      spinner.start();
    }
    
    spinner.text = 'Preparing to download logos...';
    
    const results: DownloadResult[] = [];
    
    // Process each logo
    for (let i = 0; i < logos.length; i++) {
      const logoName = logos[i];
      spinner.text = `Processing ${logoName} (${i + 1}/${logos.length})...`;
      
      // Find logo in registry
      const logo = await registry.findByName(logoName);
      
      if (!logo) {
        results.push({
          success: false,
          logoName,
          error: `Logo "${logoName}" not found. Try "logocn search ${logoName}" to find similar logos.`
        });
        continue;
      }
      
      try {
        // Check if logo already exists
        const expectedPath = path.join(logoDir, `${logo.slug}.svg`);
        if (await fs.pathExists(expectedPath)) {
          results.push({
            success: true,
            logoName: logo.name,
            filePath: expectedPath
          });
          spinner.text = `✓ ${logo.name} already exists (${i + 1}/${logos.length})`;
          continue;
        }
        
        // Download SVG from Simple Icons
        const svgContent = await simpleIcons.downloadSVG(logo.slug);
        
        // Save to file system
        const filePath = await fileManager.saveSVG(
          svgContent,
          logo.slug,
          logoDir
        );
        
        results.push({
          success: true,
          logoName: logo.name,
          filePath
        });
      } catch (error: any) {
        results.push({
          success: false,
          logoName: logo.name,
          error: error.message
        });
      }
    }
    
    spinner.stop();
    
    // Generate export file if any logos were successfully added
    const successful = results.filter(r => r.success);
    if (successful.length > 0) {
      const exportSpinner = ora('Generating export file...').start();
      try {
        await generateExportFile();
        exportSpinner.succeed('Generated export file');
      } catch (error: any) {
        if (await isZeroConfigMode()) {
          exportSpinner.warn('Component generation requires initialization');
          console.log(chalk.cyan('  Run "logocn init" to generate React components'));
          console.log(chalk.gray('  Your SVG files are ready at: ' + logoDir.replace(process.cwd() + '/', '')));
        } else {
          exportSpinner.warn('Failed to generate export file');
          console.log(chalk.gray('  Error: ' + error.message));
        }
      }
    }
    
    // Display results
    displayResults(results, logoDir);
    
  } catch (error: any) {
    spinner.fail('Failed to add logos');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

/**
 * Display the results of the add operation
 */
function displayResults(results: DownloadResult[], logoDir: string): void {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(); // Empty line for spacing
  
  if (successful.length > 0) {
    console.log(chalk.green.bold(`✓ Successfully added ${successful.length} logo${successful.length > 1 ? 's' : ''}:`));
    successful.forEach(result => {
      const relativePath = result.filePath ? 
        result.filePath.replace(process.cwd() + '/', '') : 
        'unknown';
      console.log(chalk.gray(`  • ${result.logoName} → ${relativePath}`));
    });
  }
  
  if (failed.length > 0) {
    console.log(); // Empty line for spacing
    console.log(chalk.yellow.bold(`⚠ Failed to add ${failed.length} logo${failed.length > 1 ? 's' : ''}:`));
    failed.forEach(result => {
      console.log(chalk.gray(`  • ${result.logoName}: ${result.error}`));
    });
    
    console.log();
    console.log(chalk.dim('  Tip: Use "logocn search <query>" to find the correct logo name'));
    console.log(chalk.dim('       or "logocn list" to see all available logos'));
  }
  
  if (successful.length > 0) {
    console.log();
    console.log(chalk.dim(`Logos saved to: ${logoDir.replace(process.cwd() + '/', '')}/`));
  }
}

/**
 * Handle interactive add mode
 */
async function handleInteractiveAdd(): Promise<void> {
  const spinner = ora('Loading logo registry...').start();
  
  try {
    // Initialize services
    const registry = new RegistryManager();
    
    spinner.stop();
    
    // Get all available logos with categories
    const allLogos = await registry.getAll();
    
    // Group logos by category
    const categories: Record<string, string[]> = {
      'Popular': ['react', 'vue', 'angular', 'svelte', 'nextdotjs', 'typescript', 'javascript', 'python', 'github', 'docker'],
      'Social Media': [],
      'Development Tools': [],
      'Cloud Services': [],
      'Databases': [],
      'Other': []
    };
    
    // Simple categorization based on keywords
    allLogos.forEach(logo => {
      const name = logo.name.toLowerCase();
      if (['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'x'].some(s => name.includes(s))) {
        categories['Social Media'].push(logo.name);
      } else if (['aws', 'azure', 'google', 'cloud', 'vercel', 'netlify', 'heroku'].some(s => name.includes(s))) {
        categories['Cloud Services'].push(logo.name);
      } else if (['mongodb', 'postgresql', 'mysql', 'redis', 'sqlite', 'firebase'].some(s => name.includes(s))) {
        categories['Databases'].push(logo.name);
      } else if (['git', 'docker', 'kubernetes', 'npm', 'yarn', 'webpack', 'vite', 'jest'].some(s => name.includes(s))) {
        categories['Development Tools'].push(logo.name);
      } else if (!categories['Popular'].includes(logo.slug)) {
        categories['Other'].push(logo.name);
      }
    });
    
    console.log(chalk.cyan.bold('\n🔍 Interactive Logo Selection\n'));
    
    // Interactive prompts
    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'How would you like to select logos?',
        choices: [
          { name: 'Search for specific logos', value: 'search' },
          { name: 'Browse by category', value: 'category' },
          { name: 'Add popular logos', value: 'popular' },
          { name: 'Add all from a category', value: 'category-all' }
        ]
      }
    ]);
    
    let selectedLogos: string[] = [];
    
    if (mode === 'search') {
      const { searchQuery } = await inquirer.prompt([
        {
          type: 'input',
          name: 'searchQuery',
          message: 'Enter logo names (space-separated):',
          validate: (input) => input.trim().length > 0 || 'Please enter at least one logo name'
        }
      ]);
      selectedLogos = searchQuery.trim().split(/\s+/);
      
    } else if (mode === 'category') {
      const { category } = await inquirer.prompt([
        {
          type: 'list',
          name: 'category',
          message: 'Select a category:',
          choices: Object.keys(categories).filter(cat => categories[cat].length > 0)
        }
      ]);
      
      const { logos } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'logos',
          message: `Select logos from ${category}:`,
          choices: categories[category].slice(0, 20).map(name => ({ name, value: name })),
          validate: (answer) => answer.length > 0 || 'Please select at least one logo'
        }
      ]);
      selectedLogos = logos;
      
    } else if (mode === 'popular') {
      selectedLogos = categories['Popular'];
      console.log(chalk.gray(`\nAdding ${selectedLogos.length} popular logos...`));
      
    } else if (mode === 'category-all') {
      const { category } = await inquirer.prompt([
        {
          type: 'list',
          name: 'category',
          message: 'Select a category to add all logos from:',
          choices: Object.keys(categories).filter(cat => categories[cat].length > 0 && cat !== 'Other')
        }
      ]);
      selectedLogos = categories[category];
      console.log(chalk.gray(`\nAdding all ${selectedLogos.length} logos from ${category}...`));
    }
    
    // Now add the selected logos
    if (selectedLogos.length > 0) {
      await handleAdd(selectedLogos);
    } else {
      console.log(chalk.yellow('No logos selected.'));
    }
    
  } catch (error: any) {
    spinner.fail('Failed to load logo registry');
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}