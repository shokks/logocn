import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import {
  detectFramework,
  getFrameworkConfig,
  createProjectConfig,
  saveProjectConfig,
  isProjectInitialized
} from '../utils/frameworks.js';
import { generateExportFile } from '../utils/exportGenerator.js';
import { Framework, ImportStyle } from '../types/index.js';

interface InitOptions {
  force?: boolean;
  skipInstall?: boolean;
  yes?: boolean;
}

/**
 * Handle the init command - initialize LogoCN in a project
 */
export async function handleInit(options: InitOptions = {}): Promise<void> {
  console.log();
  console.log(chalk.cyan.bold('🚀 Initialize LogoCN'));
  console.log(chalk.gray('Setting up LogoCN for optimal framework integration'));
  console.log();

  try {
    const projectPath = process.cwd();
    
    // Check if already initialized
    if (await isProjectInitialized(projectPath) && !options.force) {
      console.log(chalk.yellow('⚠  LogoCN is already initialized in this project'));
      console.log(chalk.gray('  Use --force to reinitialize'));
      console.log(chalk.gray('  Current config: logocn.config.json'));
      return;
    }

    const spinner = ora('Detecting project framework...').start();
    
    // Detect framework
    const detectedFramework = await detectFramework(projectPath);
    const frameworkConfig = getFrameworkConfig(detectedFramework);
    
    spinner.stop();
    
    if (detectedFramework === Framework.Unknown) {
      console.log(chalk.yellow('⚠  Could not detect framework'));
      console.log(chalk.gray('  LogoCN will work with basic configuration'));
    } else {
      console.log(chalk.green(`✓ Detected ${frameworkConfig.name} project`));
    }
    
    // Create initial config
    const projectConfig = await createProjectConfig(projectPath);
    
    // Interactive setup (unless --yes flag)
    if (!options.yes) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'framework',
          message: 'Select your framework:',
          default: detectedFramework,
          choices: [
            { name: 'Next.js', value: Framework.NextJS },
            { name: 'React', value: Framework.React },
            { name: 'Vue.js', value: Framework.Vue },
            { name: 'Svelte', value: Framework.Svelte },
            { name: 'Angular', value: Framework.Angular },
            { name: 'Vanilla HTML/JS', value: Framework.Vanilla }
          ]
        },
        {
          type: 'input',
          name: 'logoDirectory',
          message: 'Where should logos be saved?',
          default: (answers: any) => getFrameworkConfig(answers.framework).defaultDirectory,
          validate: (input: string) => input.trim() !== '' || 'Directory cannot be empty'
        },
      ]);
      
      // Update config with user choices
      projectConfig.framework = answers.framework;
      projectConfig.logoDirectory = answers.logoDirectory;
    }
    
    console.log();
    console.log(chalk.blue('📋 Configuration:'));
    console.log(chalk.gray(`  Framework: ${getFrameworkConfig(projectConfig.framework).name}`));
    console.log(chalk.gray(`  Directory: ${projectConfig.logoDirectory}`));
    console.log(chalk.gray(`  TypeScript: ${projectConfig.typescript ? 'Yes' : 'No'}`));
    console.log();
    
    // Install dependencies if needed
    if (!options.skipInstall) {
      await installDependencies(projectConfig.framework, options.yes);
    }
    
    // Create configuration files
    await createConfigFiles(projectConfig.framework, projectPath);
    
    // Save project config
    await saveProjectConfig(projectConfig, projectPath);
    
    // Create logo directory
    const logoPath = path.join(projectPath, projectConfig.logoDirectory);
    await fs.ensureDir(logoPath);
    
    console.log(chalk.green.bold('✅ LogoCN initialized successfully!'));
    console.log();
    console.log(chalk.bold('Next steps:'));
    console.log(chalk.gray('  1. Add your first logo:'));
    console.log(chalk.cyan(`     logocn add react`));
    console.log(chalk.gray('  2. Use in your project:'));
    
    // Create lib directory during init
    const libDir = path.dirname(path.join(projectPath, projectConfig.exportFile));
    await fs.ensureDir(libDir);
    
    // Simple usage example
    const libPath = projectConfig.exportFile.replace(/\.[jt]s$/, '');
    console.log(chalk.cyan(`     import { logos } from '${libPath}'`));
    console.log(chalk.cyan(`     <img src={logos.react} alt="React" />`));
    
    console.log();
    console.log(chalk.dim('Configuration saved to: logocn.config.json'));
    
  } catch (error: any) {
    console.error(chalk.red('✗ Failed to initialize LogoCN:'), error.message);
    process.exit(1);
  }
}

/**
 * Install required dependencies for the framework
 */
async function installDependencies(framework: Framework, skipPrompts: boolean = false): Promise<void> {
  const frameworkConfig = getFrameworkConfig(framework);
  const devDeps = frameworkConfig.devDependencies;
  
  if (devDeps.length === 0) {
    return;
  }
  
  console.log(chalk.blue('📦 Installing dependencies...'));
  
  // Check if dependencies are already installed
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  let packageJson: any = {};
  
  if (await fs.pathExists(packageJsonPath)) {
    try {
      packageJson = await fs.readJson(packageJsonPath);
    } catch (error) {
      // Continue without package.json check
    }
  }
  
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };
  
  const missingDeps = devDeps.filter(dep => !allDeps[dep]);
  
  if (missingDeps.length === 0) {
    console.log(chalk.green('✓ All required dependencies already installed'));
    return;
  }
  
  if (!skipPrompts) {
    const { installDeps } = await inquirer.prompt([{
      type: 'confirm',
      name: 'installDeps',
      message: `Install ${missingDeps.join(', ')} for ${getFrameworkConfig(framework).name} SVG support?`,
      default: true
    }]);
    
    if (!installDeps) {
      console.log(chalk.yellow('⚠  Skipping dependency installation'));
      console.log(chalk.gray(`  You can install manually: npm install --save-dev ${missingDeps.join(' ')}`));
      return;
    }
  }
  
  const spinner = ora(`Installing ${missingDeps.join(', ')}...`).start();
  
  try {
    // Detect package manager
    const hasYarnLock = await fs.pathExists(path.join(process.cwd(), 'yarn.lock'));
    const hasPnpmLock = await fs.pathExists(path.join(process.cwd(), 'pnpm-lock.yaml'));
    
    let command: string;
    if (hasPnpmLock) {
      command = `pnpm add -D ${missingDeps.join(' ')}`;
    } else if (hasYarnLock) {
      command = `yarn add --dev ${missingDeps.join(' ')}`;
    } else {
      command = `npm install --save-dev ${missingDeps.join(' ')}`;
    }
    
    execSync(command, { stdio: 'ignore' });
    
    spinner.succeed(`Installed ${missingDeps.join(', ')}`);
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    console.log(chalk.yellow('⚠  Please install manually:'));
    console.log(chalk.cyan(`npm install --save-dev ${missingDeps.join(' ')}`));
  }
}

/**
 * Create framework-specific configuration files
 */
async function createConfigFiles(framework: Framework, projectPath: string): Promise<void> {
  const frameworkConfig = getFrameworkConfig(framework);
  
  for (const configFile of frameworkConfig.configFiles) {
    const filePath = path.join(projectPath, configFile.path);
    
    // Check if file already exists
    if (await fs.pathExists(filePath)) {
      const { overwrite } = await inquirer.prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: `${configFile.path} already exists. Overwrite?`,
        default: false
      }]);
      
      if (!overwrite) {
        console.log(chalk.yellow(`⚠  Skipping ${configFile.path}`));
        continue;
      }
    }
    
    try {
      await fs.writeFile(filePath, configFile.content);
      console.log(chalk.green(`✓ Created ${configFile.path}`));
    } catch (error) {
      console.log(chalk.yellow(`⚠  Failed to create ${configFile.path}`));
    }
  }
}