import chalk from 'chalk';
import { RegistryManager } from '../utils/registry.js';
import { Logo } from '../types/index.js';

/**
 * Handle the search command - search for logos by query
 */
export async function handleSearch(query: string): Promise<void> {
  if (!query || query.trim() === '') {
    console.error(chalk.red('✗ Please provide a search query'));
    console.log(chalk.gray('  Example: logocn search "social media"'));
    console.log(chalk.gray('           logocn search database'));
    process.exit(1);
  }
  
  try {
    const registry = new RegistryManager();
    await registry.load();
    
    const results = registry.search(query);
    
    console.log();
    
    if (results.length === 0) {
      console.log(chalk.yellow(`No logos found matching "${query}"`));
      console.log();
      console.log(chalk.dim('Suggestions:'));
      console.log(chalk.dim('  • Try a different search term'));
      console.log(chalk.dim('  • Use "logocn list" to see all available logos'));
      console.log(chalk.dim('  • Search by category: tech, social, development, etc.'));
      return;
    }
    
    // Display search results
    console.log(chalk.cyan.bold(`🔍 Search Results for "${query}"`));
    console.log(chalk.gray(`   Found ${results.length} matching logo${results.length > 1 ? 's' : ''}`));
    console.log();
    
    // Group results by category for better organization
    const grouped = results.reduce((acc, logo) => {
      if (!acc[logo.category]) acc[logo.category] = [];
      acc[logo.category].push(logo);
      return acc;
    }, {} as Record<string, Logo[]>);
    
    // Display results by category
    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, logos]) => {
        console.log(chalk.yellow.bold(`${category.toUpperCase()}`));
        console.log(chalk.gray('─'.repeat(50)));
        
        logos.forEach(logo => {
          // Display logo name and slug
          console.log(`  ${chalk.bold(logo.name)} ${chalk.gray(`(${logo.slug})`)}`);
          
          // Display tags
          if (logo.tags.length > 0) {
            const displayTags = logo.tags.slice(0, 5).join(', ');
            const moreTags = logo.tags.length > 5 ? `, +${logo.tags.length - 5} more` : '';
            console.log(chalk.gray(`    Tags: ${displayTags}${moreTags}`));
          }
          
          // Display aliases if present
          if (logo.aliases && logo.aliases.length > 0) {
            console.log(chalk.gray(`    Also known as: ${logo.aliases.join(', ')}`));
          }
          
          console.log();
        });
      });
    
    // Display usage hint
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.dim('To add a logo to your project:'));
    console.log(chalk.dim(`  logocn add <logo-name>`));
    console.log();
    console.log(chalk.dim('Example:'));
    const firstResult = results[0];
    console.log(chalk.dim(`  logocn add ${firstResult.slug}`));
    
  } catch (error: any) {
    console.error(chalk.red('Search failed:'), error.message);
    process.exit(1);
  }
}