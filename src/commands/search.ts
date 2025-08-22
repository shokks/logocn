import chalk from 'chalk';
import { RegistryManager } from '../utils/registry.js';

/**
 * Handle the search command - search for logos by query
 */
export async function handleSearch(query: string): Promise<void> {
  if (!query || query.trim() === '') {
    console.error(chalk.red('✗ Please provide a search query'));
    console.log(chalk.gray('  Example: logocn search react'));
    console.log(chalk.gray('           logocn search database'));
    process.exit(1);
  }
  
  try {
    const registry = new RegistryManager();
    const results = await registry.search(query);
    
    console.log();
    
    if (results.length === 0) {
      console.log(chalk.yellow(`No logos found matching "${query}"`));
      console.log();
      console.log(chalk.dim('Suggestions:'));
      console.log(chalk.dim('  • Try a shorter search term'));
      console.log(chalk.dim('  • Use "logocn list" to browse all logos'));
      console.log(chalk.dim('  • Use "logocn list --page 1" to see the first page'));
      return;
    }
    
    // Display search results
    console.log(chalk.cyan.bold(`🔍 Search Results for "${query}"`));
    console.log(chalk.gray(`   Found ${results.length} matching logo${results.length > 1 ? 's' : ''}`));
    console.log();
    
    // Display results (limit to 50 for readability)
    const displayResults = results.slice(0, 50);
    
    displayResults.forEach(logo => {
      // Display logo name and slug
      console.log(`  ${chalk.bold(logo.name)} ${chalk.gray(`[${logo.slug}]`)}`);
      
      // Display aliases if present
      if (logo.aliases && logo.aliases.length > 0) {
        console.log(chalk.gray(`    Also known as: ${logo.aliases.join(', ')}`));
      }
      
      console.log();
    });
    
    if (results.length > 50) {
      console.log(chalk.dim(`  ...and ${results.length - 50} more results`));
      console.log(chalk.dim(`  Refine your search for more specific results`));
      console.log();
    }
    
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
    console.log(chalk.dim('\nTry running "logocn update" to refresh the logo cache'));
    process.exit(1);
  }
}