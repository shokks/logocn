import chalk from 'chalk';
import ora from 'ora';
import { CacheManager } from '../utils/cache.js';
import { RegistryManager } from '../utils/registry.js';

/**
 * Handle the update command - refresh the Simple Icons cache
 */
export async function handleUpdate(): Promise<void> {
  const spinner = ora('Checking for updates...').start();
  
  try {
    const cache = new CacheManager();
    
    // Get current cache stats
    const statsBefore = await cache.getCacheStats();
    
    // Update the cache
    spinner.text = 'Downloading latest Simple Icons metadata...';
    await cache.updateCache();
    
    // Force registry to reload
    const registry = new RegistryManager();
    await registry.refresh();
    
    // Get new stats
    const statsAfter = await cache.getCacheStats();
    
    spinner.succeed('Cache updated successfully');
    
    console.log();
    console.log(chalk.green.bold('✅ Simple Icons cache updated'));
    
    if (statsAfter.count) {
      console.log(chalk.gray(`   ${statsAfter.count.toLocaleString()} logos available`));
    }
    
    if (statsBefore.exists && statsBefore.count && statsAfter.count) {
      const diff = statsAfter.count - statsBefore.count;
      if (diff > 0) {
        console.log(chalk.cyan(`   +${diff} new logos added`));
      } else if (diff < 0) {
        console.log(chalk.yellow(`   ${Math.abs(diff)} logos removed`));
      }
    }
    
    console.log();
    console.log(chalk.dim('You can now use the latest logos with:'));
    console.log(chalk.dim('  • logocn add <logo-name>'));
    console.log(chalk.dim('  • logocn search <query>'));
    console.log(chalk.dim('  • logocn list'));
    
  } catch (error: any) {
    spinner.fail('Failed to update cache');
    console.error(chalk.red('\nError:'), error.message);
    console.log(chalk.dim('\nPlease check your internet connection and try again'));
    process.exit(1);
  }
}

/**
 * Export for use in index.ts
 */
export { handleUpdate as update };