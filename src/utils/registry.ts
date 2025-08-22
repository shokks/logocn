import { CacheManager, SimpleIcon } from './cache.js';

export interface Logo {
  name: string;
  slug: string;
  hex: string;
  source: string;
  aliases?: string[];
}

export class RegistryManager {
  private cache: CacheManager;
  private logos: Logo[] | null = null;

  constructor() {
    this.cache = new CacheManager();
  }

  /**
   * Ensure logos are loaded from cache
   */
  private async ensureLoaded(): Promise<void> {
    if (this.logos === null) {
      const data = await this.cache.getMetadata();
      this.logos = data.icons.map(icon => this.convertToLogo(icon));
    }
  }

  /**
   * Convert Simple Icons format to our Logo format
   */
  private convertToLogo(icon: SimpleIcon): Logo {
    const aliases: string[] = [];
    
    // Extract aliases from various formats
    if (icon.aliases?.aka) {
      aliases.push(...icon.aliases.aka);
    }
    if (icon.aliases?.loc) {
      aliases.push(...Object.values(icon.aliases.loc));
    }
    
    return {
      name: icon.title,
      slug: icon.slug || this.generateSlug(icon.title),
      hex: icon.hex,
      source: icon.source,
      aliases: aliases.length > 0 ? aliases : undefined
    };
  }

  /**
   * Generate slug from title
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
   * Find a logo by name, slug, or alias
   */
  async findByName(query: string): Promise<Logo | undefined> {
    await this.ensureLoaded();
    
    const normalized = query.toLowerCase();
    
    // Try exact match on name
    let logo = this.logos!.find(l => l.name.toLowerCase() === normalized);
    if (logo) return logo;
    
    // Try exact match on slug
    logo = this.logos!.find(l => l.slug === normalized);
    if (logo) return logo;
    
    // Try exact match on aliases
    logo = this.logos!.find(l => 
      l.aliases?.some(alias => alias.toLowerCase() === normalized)
    );
    if (logo) return logo;
    
    // Try prefix match on name
    logo = this.logos!.find(l => l.name.toLowerCase().startsWith(normalized));
    if (logo) return logo;
    
    // Try prefix match on slug
    logo = this.logos!.find(l => l.slug.startsWith(normalized));
    if (logo) return logo;
    
    // Try substring match on name
    logo = this.logos!.find(l => l.name.toLowerCase().includes(normalized));
    if (logo) return logo;
    
    // Try substring match on slug
    logo = this.logos!.find(l => l.slug.includes(normalized));
    if (logo) return logo;
    
    return undefined;
  }

  /**
   * Search for logos by query
   */
  async search(query: string): Promise<Logo[]> {
    await this.ensureLoaded();
    
    const normalized = query.toLowerCase();
    const results: Array<{ logo: Logo; score: number }> = [];
    
    for (const logo of this.logos!) {
      let score = 0;
      
      // Exact name match
      if (logo.name.toLowerCase() === normalized) {
        score = 100;
      }
      // Exact slug match
      else if (logo.slug === normalized) {
        score = 95;
      }
      // Exact alias match
      else if (logo.aliases?.some(a => a.toLowerCase() === normalized)) {
        score = 90;
      }
      // Name starts with query
      else if (logo.name.toLowerCase().startsWith(normalized)) {
        score = 80;
      }
      // Slug starts with query
      else if (logo.slug.startsWith(normalized)) {
        score = 75;
      }
      // Name contains query
      else if (logo.name.toLowerCase().includes(normalized)) {
        score = 60;
      }
      // Slug contains query
      else if (logo.slug.includes(normalized)) {
        score = 55;
      }
      // Alias contains query
      else if (logo.aliases?.some(a => a.toLowerCase().includes(normalized))) {
        score = 40;
      }
      
      if (score > 0) {
        results.push({ logo, score });
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .map(r => r.logo);
  }

  /**
   * Get all logos
   */
  async getAll(): Promise<Logo[]> {
    await this.ensureLoaded();
    return this.logos!;
  }

  /**
   * Get total count
   */
  async getCount(): Promise<number> {
    await this.ensureLoaded();
    return this.logos!.length;
  }

  /**
   * Get all logo names
   */
  async getAllNames(): Promise<string[]> {
    await this.ensureLoaded();
    return this.logos!.map(l => l.name);
  }

  /**
   * Get paginated logos
   */
  async getPaginated(page: number, pageSize: number = 50): Promise<{
    logos: Logo[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    await this.ensureLoaded();
    
    const totalCount = this.logos!.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.min(Math.max(1, page), totalPages);
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      logos: this.logos!.slice(start, end),
      totalPages,
      currentPage,
      totalCount
    };
  }

  /**
   * Refresh the cache
   */
  async refresh(): Promise<void> {
    await this.cache.updateCache();
    this.logos = null; // Force reload on next access
  }
}