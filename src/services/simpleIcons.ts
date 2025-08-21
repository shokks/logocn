import fetch from 'node-fetch';

const SIMPLE_ICONS_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons';

export class SimpleIconsService {
  /**
   * Download SVG content from Simple Icons CDN
   */
  async downloadSVG(slug: string): Promise<string> {
    const url = `${SIMPLE_ICONS_CDN}/${slug}.svg`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const svgContent = await response.text();
      
      // Validate it's actually SVG
      if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
        throw new Error('Invalid SVG content received');
      }
      
      return svgContent;
    } catch (error: any) {
      throw new Error(`Failed to download ${slug}: ${error.message}`);
    }
  }
  
  /**
   * Get the CDN URL for a logo
   */
  getIconUrl(slug: string): string {
    return `${SIMPLE_ICONS_CDN}/${slug}.svg`;
  }
  
  /**
   * Validate if a slug follows Simple Icons naming convention
   */
  validateSlug(slug: string): boolean {
    // Simple Icons slugs are lowercase alphanumeric with hyphens
    return /^[a-z0-9-]+$/.test(slug);
  }
  
  /**
   * Normalize a name to Simple Icons slug format
   */
  normalizeToSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}