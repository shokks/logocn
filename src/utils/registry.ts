import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// @ts-ignore - fuzzy doesn't have types
import fuzzy from 'fuzzy';
import { Logo, LogoRegistry } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class RegistryManager {
  private logos: Logo[] = [];
  private registryData: LogoRegistry | null = null;
  
  /**
   * Load the logo registry from the data file
   */
  async load(): Promise<void> {
    try {
      const registryPath = path.join(__dirname, '../../src/data/logos.json');
      this.registryData = await fs.readJson(registryPath);
      this.logos = this.registryData?.logos || [];
    } catch (error) {
      // If registry doesn't exist yet, initialize with empty array
      console.warn('Registry not found, initializing empty registry');
      this.logos = [];
      this.registryData = {
        version: '1.0.0',
        source: 'simple-icons',
        sourceVersion: '9.0.0',
        logos: []
      };
    }
  }
  
  /**
   * Find a logo by its slug
   */
  findBySlug(slug: string): Logo | undefined {
    const normalizedSlug = slug.toLowerCase();
    return this.logos.find(logo => 
      logo.slug === normalizedSlug || 
      logo.aliases?.includes(normalizedSlug)
    );
  }
  
  /**
   * Find a logo by its name (fuzzy matching)
   */
  findByName(name: string): Logo | undefined {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // First try exact matches
    const exactMatch = this.logos.find(logo => {
      const logoName = logo.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const logoSlug = logo.slug.replace(/-/g, '');
      return logoName === normalized || 
             logoSlug === normalized ||
             logo.aliases?.some(alias => alias.replace(/[^a-z0-9]/g, '') === normalized);
    });
    
    if (exactMatch) return exactMatch;
    
    // Try fuzzy matching if no exact match
    const searchResults = this.search(name);
    return searchResults.length > 0 ? searchResults[0] : undefined;
  }
  
  /**
   * Search for logos using fuzzy matching
   */
  search(query: string): Logo[] {
    if (!query || query.trim() === '') return [];
    
    const searchFields = this.logos.map(logo => ({
      logo,
      searchString: `${logo.name} ${logo.slug} ${logo.tags.join(' ')} ${logo.aliases?.join(' ') || ''} ${logo.category}`
    }));
    
    const results = fuzzy.filter(query, searchFields, {
      extract: (item: any) => item.searchString
    });
    
    return results.map((result: any) => result.original.logo);
  }
  
  /**
   * List logos by category
   */
  listByCategory(category?: string): Logo[] {
    if (!category) return this.logos;
    return this.logos.filter(logo => logo.category.toLowerCase() === category.toLowerCase());
  }
  
  /**
   * Get all logo names
   */
  getAllNames(): string[] {
    return this.logos.map(logo => logo.name);
  }
  
  /**
   * Get all unique categories
   */
  getCategories(): string[] {
    const categories = new Set(this.logos.map(logo => logo.category));
    return Array.from(categories).sort();
  }
  
  /**
   * Get all logos
   */
  getAll(): Logo[] {
    return this.logos;
  }
  
  /**
   * Get total count
   */
  getCount(): number {
    return this.logos.length;
  }
  
  /**
   * Get registry metadata
   */
  getMetadata(): Omit<LogoRegistry, 'logos'> | null {
    if (!this.registryData) return null;
    const { logos, ...metadata } = this.registryData;
    return metadata;
  }
}