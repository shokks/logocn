import chalk from 'chalk';
import { RegistryManager } from '../utils/registry.js';
import { Logo } from '../types/index.js';

/**
 * Handle the list command - display all available logos
 */
export async function handleList(options: { category?: string }): Promise<void> {
  try {
    const registry = new RegistryManager();
    await registry.load();
    
    const logos = options.category 
      ? registry.listByCategory(options.category)
      : registry.getAll();
    
    const categories = registry.getCategories();
    const metadata = registry.getMetadata();
    
    // Display header
    console.log();
    console.log(chalk.cyan.bold('📦 Available Logos'));
    if (metadata) {
      console.log(chalk.gray(`   Source: ${metadata.source} v${metadata.sourceVersion}`));
    }
    console.log();
    
    if (options.category) {
      if (logos.length === 0) {
        console.log(chalk.yellow(`No logos found in category: ${options.category}`));
        console.log(chalk.gray(`Available categories: ${categories.join(', ')}`));
        return;
      }
      console.log(chalk.gray(`Showing category: ${options.category}`));
      console.log();
    }
    
    // Group logos by category
    const grouped = logos.reduce((acc, logo) => {
      if (!acc[logo.category]) acc[logo.category] = [];
      acc[logo.category].push(logo);
      return acc;
    }, {} as Record<string, Logo[]>);
    
    // Display logos by category
    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, categoryLogos]) => {
        // Category header
        console.log(chalk.yellow.bold(`${category.toUpperCase()} (${categoryLogos.length})`));
        console.log(chalk.gray('─'.repeat(50)));
        
        // Sort logos by name
        const sortedLogos = categoryLogos.sort((a, b) => a.name.localeCompare(b.name));
        
        // Display in columns
        const columns = 3;
        const columnWidth = 20;
        
        for (let i = 0; i < sortedLogos.length; i += columns) {
          const row = [];
          for (let j = 0; j < columns; j++) {
            const index = i + j;
            if (index < sortedLogos.length) {
              const logo = sortedLogos[index];
              const name = logo.name.length > columnWidth - 2 
                ? logo.name.substring(0, columnWidth - 5) + '...' 
                : logo.name;
              row.push(name.padEnd(columnWidth));
            }
          }
          console.log('  ' + row.join(''));
        }
        console.log();
      });
    
    // Display summary
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.dim(`Total: ${logos.length} logos in ${categories.length} categories`));
    console.log();
    console.log(chalk.dim('Usage:'));
    console.log(chalk.dim('  • Add a logo:     logocn add <logo-name>'));
    console.log(chalk.dim('  • Search logos:   logocn search <query>'));
    console.log(chalk.dim('  • Filter by category: logocn list --category <category>'));
    
  } catch (error: any) {
    console.error(chalk.red('Failed to list logos:'), error.message);
    process.exit(1);
  }
}