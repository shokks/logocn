import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import fetch from 'node-fetch';
import chalk from 'chalk';

const CACHE_DIR = path.join(os.homedir(), '.logocn', 'cache');
const METADATA_FILE = path.join(CACHE_DIR, 'simple-icons.json');
const SIMPLE_ICONS_URL = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/_data/simple-icons.json';
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface SimpleIcon {
  title: string;
  hex: string;
  source: string;
  slug?: string;
  aliases?: {
    aka?: string[];
    dup?: Array<{ title: string; hex?: string; source?: string }>;
    loc?: Record<string, string>;
  };
  guidelines?: string;
  license?: {
    type: string;
    url?: string;
  };
}

export interface SimpleIconsData {
  icons: SimpleIcon[];
}

export class CacheManager {
  /**
   * Ensure cache directory exists
   */
  private async ensureCacheDir(): Promise<void> {
    await fs.ensureDir(CACHE_DIR);
  }

  /**
   * Check if cache exists and is valid
   */
  async isCacheValid(): Promise<boolean> {
    try {
      if (!await fs.pathExists(METADATA_FILE)) {
        return false;
      }

      const stats = await fs.stat(METADATA_FILE);
      const age = Date.now() - stats.mtime.getTime();
      
      return age < CACHE_MAX_AGE;
    } catch {
      return false;
    }
  }

  /**
   * Download and cache Simple Icons metadata
   */
  async updateCache(): Promise<void> {
    console.log(chalk.cyan('📦 Downloading Simple Icons metadata...'));
    
    try {
      await this.ensureCacheDir();
      
      const response = await fetch(SIMPLE_ICONS_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json() as SimpleIconsData;
      
      // Add generated slugs for icons that don't have them
      data.icons = data.icons.map(icon => ({
        ...icon,
        slug: icon.slug || this.generateSlug(icon.title)
      }));
      
      await fs.writeJSON(METADATA_FILE, data, { spaces: 2 });
      
      console.log(chalk.green(`✅ Cached ${data.icons.length} logos`));
    } catch (error: any) {
      throw new Error(`Failed to update cache: ${error.message}`);
    }
  }

  /**
   * Get cached metadata, downloading if necessary
   */
  async getMetadata(forceRefresh = false): Promise<SimpleIconsData> {
    if (forceRefresh || !(await this.isCacheValid())) {
      await this.updateCache();
    }
    
    try {
      const data = await fs.readJSON(METADATA_FILE) as SimpleIconsData;
      return data;
    } catch (error: any) {
      // If reading fails, try to update cache
      await this.updateCache();
      return await fs.readJSON(METADATA_FILE) as SimpleIconsData;
    }
  }

  /**
   * Generate slug from title (matching Simple Icons convention)
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\+/g, 'plus')
      .replace(/\./g, 'dot')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]/g, '');
  }

  /**
   * Clear the cache
   */
  async clearCache(): Promise<void> {
    if (await fs.pathExists(METADATA_FILE)) {
      await fs.remove(METADATA_FILE);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{ exists: boolean; age?: number; count?: number }> {
    if (!await fs.pathExists(METADATA_FILE)) {
      return { exists: false };
    }

    const stats = await fs.stat(METADATA_FILE);
    const age = Date.now() - stats.mtime.getTime();
    
    try {
      const data = await fs.readJSON(METADATA_FILE) as SimpleIconsData;
      return {
        exists: true,
        age: Math.floor(age / 1000 / 60 / 60), // age in hours
        count: data.icons.length
      };
    } catch {
      return { exists: true, age: Math.floor(age / 1000 / 60 / 60) };
    }
  }
}