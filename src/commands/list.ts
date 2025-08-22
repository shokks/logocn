import chalk from 'chalk';
import { RegistryManager } from '../utils/registry.js';

/**
 * Handle the list command - display available logos with pagination
 */
export async function handleList(options: { 
  page?: string;
  search?: string;
}): Promise<void> {
  try {
    const registry = new RegistryManager();
    const page = parseInt(options.page || '1', 10);
    const pageSize = 50;
    
    // If search is provided, show search results instead
    if (options.search) {
      const results = await registry.search(options.search);
      
      if (results.length === 0) {
        console.log(chalk.yellow(`\nNo logos found matching "${options.search}"`));
        console.log(chalk.dim('Try a different search term or use "logocn list" to see all logos'));
        return;
      }
      
      console.log(chalk.cyan.bold(`\n🔍 Search Results for "${options.search}"`));
      console.log(chalk.gray(`Found ${results.length} matching logos\n`));
      
      // Display search results (limited to first 50)
      const displayResults = results.slice(0, 50);
      displayResults.forEach(logo => {
        const aliases = logo.aliases ? chalk.gray(` (aliases: ${logo.aliases.join(', ')})`) : '';
        console.log(`  ${chalk.bold(logo.name)} ${chalk.gray(`[${logo.slug}]`)}${aliases}`);
      });
      
      if (results.length > 50) {
        console.log(chalk.dim(`\n  ...and ${results.length - 50} more results`));
      }
      
      console.log();
      return;
    }
    
    // Get paginated logos
    const { logos, totalPages, currentPage, totalCount } = await registry.getPaginated(page, pageSize);
    
    // Display header
    console.log();
    console.log(chalk.cyan.bold('📦 Available Logos'));
    console.log(chalk.gray(`   ${totalCount.toLocaleString()} logos from Simple Icons`));
    console.log(chalk.gray(`   Page ${currentPage} of ${totalPages}`));
    console.log();
    
    // Display logos in a simple list
    logos.forEach(logo => {
      const aliases = logo.aliases ? chalk.gray(` (${logo.aliases[0]})`) : '';
      console.log(`  ${logo.name} ${chalk.gray(`[${logo.slug}]`)}${aliases}`);
    });
    
    console.log();
    console.log(chalk.gray('─'.repeat(50)));
    
    // Navigation hints
    if (totalPages > 1) {
      const navHints = [];
      if (currentPage > 1) {
        navHints.push(`Previous: logocn list --page ${currentPage - 1}`);
      }
      if (currentPage < totalPages) {
        navHints.push(`Next: logocn list --page ${currentPage + 1}`);
      }
      if (navHints.length > 0) {
        console.log(chalk.dim(navHints.join(' | ')));
      }
    }
    
    console.log(chalk.dim('Usage:'));
    console.log(chalk.dim('  • Add a logo:     logocn add <logo-name>'));
    console.log(chalk.dim('  • Search logos:   logocn list --search <query>'));
    console.log(chalk.dim('  • Navigate pages: logocn list --page <number>'));
    console.log(chalk.dim('  • Update cache:   logocn update'));
    
  } catch (error: any) {
    console.error(chalk.red('Failed to list logos:'), error.message);
    console.log(chalk.dim('\nTry running "logocn update" to refresh the logo cache'));
    process.exit(1);
  }
}