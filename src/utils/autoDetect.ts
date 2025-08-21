import fs from 'fs-extra';
import path from 'path';
import { Framework, ProjectConfig, ImportStyle } from '../types/index.js';
import { detectFramework, FRAMEWORK_CONFIGS } from './frameworks.js';

/**
 * Common logo directory patterns to check
 */
const COMMON_LOGO_DIRECTORIES = [
  'components/logos',
  'src/components/logos',
  'src/logos',
  'public/logos',
  'assets/logos',
  'src/assets/logos',
  'lib/logos',
  'src/lib/logos',
  'components/icons',
  'src/components/icons',
  'src/icons',
];

/**
 * Auto-detect the best logo directory for the project
 */
export async function autoDetectLogoDirectory(projectPath: string = process.cwd()): Promise<string> {
  // First check if any common directories already exist
  for (const dir of COMMON_LOGO_DIRECTORIES) {
    const fullPath = path.join(projectPath, dir);
    if (await fs.pathExists(fullPath)) {
      return dir;
    }
  }
  
  // If none exist, detect framework and use its default
  const framework = await detectFramework(projectPath);
  if (framework) {
    const config = FRAMEWORK_CONFIGS[framework];
    return config.defaultDirectory;
  }
  
  // Fallback to most common pattern
  return 'components/logos';
}

/**
 * Check if project has TypeScript
 */
export async function hasTypeScript(projectPath: string = process.cwd()): Promise<boolean> {
  const tsConfigPath = path.join(projectPath, 'tsconfig.json');
  return fs.pathExists(tsConfigPath);
}

/**
 * Get or create project configuration with smart defaults
 */
export async function getOrCreateProjectConfig(projectPath: string = process.cwd()): Promise<ProjectConfig> {
  const configPath = path.join(projectPath, 'logocn.config.json');
  
  // If config exists, use it
  if (await fs.pathExists(configPath)) {
    const config = await fs.readJson(configPath);
    return config as ProjectConfig;
  }
  
  // Otherwise, create smart defaults
  const framework = await detectFramework(projectPath);
  const logoDirectory = await autoDetectLogoDirectory(projectPath);
  const typescript = await hasTypeScript(projectPath);
  
  const config: ProjectConfig = {
    framework: framework || Framework.React,
    logoDirectory,
    typescript,
    exportFile: 'lib/logos.ts',
    importStyle: ImportStyle.Static,
    generateComponent: true,
    version: '1.0.0'
  };
  
  // For zero-config mode, we don't save the config file
  // It will be created when user runs init or modifies settings
  return config;
}

/**
 * Check if project is in zero-config mode (no config file)
 */
export async function isZeroConfigMode(projectPath: string = process.cwd()): Promise<boolean> {
  const configPath = path.join(projectPath, 'logocn.config.json');
  return !(await fs.pathExists(configPath));
}

/**
 * Find the best matching logo for fuzzy search
 */
export function fuzzySearchLogo(query: string, logos: string[]): string | null {
  const lowerQuery = query.toLowerCase();
  
  // First try exact match
  const exactMatch = logos.find(logo => logo.toLowerCase() === lowerQuery);
  if (exactMatch) return exactMatch;
  
  // Then try starts with
  const startsWithMatch = logos.find(logo => logo.toLowerCase().startsWith(lowerQuery));
  if (startsWithMatch) return startsWithMatch;
  
  // Then try contains
  const containsMatch = logos.find(logo => logo.toLowerCase().includes(lowerQuery));
  if (containsMatch) return containsMatch;
  
  // Finally try common aliases
  const aliases: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'gh': 'github',
    'fb': 'facebook',
    'ig': 'instagram',
    'tw': 'twitter',
    'x': 'x',
    'yt': 'youtube',
    'npm': 'npm',
    'node': 'nodedotjs',
    'next': 'nextdotjs',
    'vue': 'vuedotjs',
    'nuxt': 'nuxtdotjs',
  };
  
  const aliasMatch = aliases[lowerQuery];
  if (aliasMatch) {
    const aliasLogo = logos.find(logo => logo.toLowerCase() === aliasMatch);
    if (aliasLogo) return aliasLogo;
  }
  
  return null;
}