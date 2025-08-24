export interface Logo {
  name: string;           // Display name (e.g., "Apple")
  slug: string;           // Simple Icons slug (e.g., "apple")
  hex: string;            // Brand color
  source: string;         // Official source URL
  aliases?: string[];     // Alternative names for search
}

export interface Config {
  logoDirectory: string;  // Where to save logos
  useColor: boolean;      // Whether to use colored output
  registry?: string;      // Custom registry URL (future)
}

export interface DownloadResult {
  success: boolean;
  logoName: string;
  filePath?: string;
  error?: string;
}


export interface ProjectConfig {
  framework: Framework;
  logoDirectory: string;
  importStyle: ImportStyle;
  typescript: boolean;
  exportFile: string;
  generateComponent: boolean;
  version: string;
  keepOriginalSvgs?: boolean;  // Whether to keep SVG files after inlining (default: false)
}

export enum Framework {
  NextJS = "nextjs",
  React = "react", 
  Vue = "vue",
  Svelte = "svelte",
  Angular = "angular",
  Vanilla = "vanilla",
  Unknown = "unknown"
}

export enum ImportStyle {
  Component = "component",  // Import as React component
  URL = "url",             // Import as URL/path
  Static = "static"        // Static file reference
}

export interface FrameworkConfig {
  name: string;
  detectFiles: string[];
  dependencies: string[];
  devDependencies: string[];
  configFiles: {
    path: string;
    content: string;
  }[];
  defaultDirectory: string;
  defaultExportFile: string;
  importStyle: ImportStyle;
  generateComponent: boolean;
}