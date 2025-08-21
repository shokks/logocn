import fs from 'fs-extra';
import path from 'path';
import { Framework, FrameworkConfig, ImportStyle, ProjectConfig } from '../types/index.js';

/**
 * Framework configurations for different project types
 */
export const FRAMEWORK_CONFIGS: Record<Framework, FrameworkConfig> = {
  [Framework.NextJS]: {
    name: 'Next.js',
    detectFiles: ['next.config.js', 'next.config.mjs', 'next.config.ts'],
    dependencies: [],
    devDependencies: ['@svgr/webpack'],
    configFiles: [
      {
        path: 'next.config.js',
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  }
}

module.exports = nextConfig`
      }
    ],
    defaultDirectory: 'components/logos',
    defaultExportFile: 'lib/logos.ts',
    importStyle: ImportStyle.Static,
    generateComponent: false
  },
  
  [Framework.React]: {
    name: 'React',
    detectFiles: ['src/App.js', 'src/App.tsx', 'src/App.jsx'],
    dependencies: [],
    devDependencies: ['@svgr/webpack'],
    configFiles: [],
    defaultDirectory: 'src/components/logos',
    defaultExportFile: 'src/lib/logos.ts',
    importStyle: ImportStyle.Static,
    generateComponent: false
  },
  
  [Framework.Vue]: {
    name: 'Vue.js',
    detectFiles: ['vue.config.js', 'vite.config.js', 'src/App.vue'],
    dependencies: [],
    devDependencies: ['vite-svg-loader'],
    configFiles: [
      {
        path: 'vite.config.js',
        content: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [vue(), svgLoader()]
})`
      }
    ],
    defaultDirectory: 'src/components/logos',
    defaultExportFile: 'src/lib/logos.ts',
    importStyle: ImportStyle.Component,
    generateComponent: false
  },
  
  [Framework.Svelte]: {
    name: 'Svelte',
    detectFiles: ['svelte.config.js', 'src/App.svelte'],
    dependencies: [],
    devDependencies: [],
    configFiles: [],
    defaultDirectory: 'src/lib/logos',
    defaultExportFile: 'src/lib/logos.ts',
    importStyle: ImportStyle.URL,
    generateComponent: false
  },
  
  [Framework.Angular]: {
    name: 'Angular',
    detectFiles: ['angular.json', 'src/app/app.component.ts'],
    dependencies: [],
    devDependencies: [],
    configFiles: [],
    defaultDirectory: 'src/assets/logos',
    defaultExportFile: 'src/lib/logos.ts',
    importStyle: ImportStyle.URL,
    generateComponent: false
  },
  
  [Framework.Vanilla]: {
    name: 'Vanilla HTML/JS',
    detectFiles: ['index.html'],
    dependencies: [],
    devDependencies: [],
    configFiles: [],
    defaultDirectory: 'assets/logos',
    defaultExportFile: 'lib/logos.js',
    importStyle: ImportStyle.Static,
    generateComponent: false
  },
  
  [Framework.Unknown]: {
    name: 'Unknown',
    detectFiles: [],
    dependencies: [],
    devDependencies: [],
    configFiles: [],
    defaultDirectory: 'logos',
    defaultExportFile: 'lib/logos.js',
    importStyle: ImportStyle.Static,
    generateComponent: false
  }
};

/**
 * Detect the framework being used in the current directory
 */
export async function detectFramework(projectPath: string = process.cwd()): Promise<Framework> {
  // Check package.json for framework dependencies
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJson(packageJsonPath);
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      // Check for Next.js
      if (allDeps.next) {
        return Framework.NextJS;
      }
      
      // Check for Vue
      if (allDeps.vue || allDeps['@vue/cli-service']) {
        return Framework.Vue;
      }
      
      // Check for Angular
      if (allDeps['@angular/core']) {
        return Framework.Angular;
      }
      
      // Check for Svelte
      if (allDeps.svelte) {
        return Framework.Svelte;
      }
      
      // Check for React (check this last as Next.js also has React)
      if (allDeps.react) {
        return Framework.React;
      }
    } catch (error) {
      // Continue with file-based detection
    }
  }
  
  // Fall back to file-based detection
  for (const [framework, config] of Object.entries(FRAMEWORK_CONFIGS)) {
    for (const detectFile of config.detectFiles) {
      const filePath = path.join(projectPath, detectFile);
      if (await fs.pathExists(filePath)) {
        return framework as Framework;
      }
    }
  }
  
  return Framework.Unknown;
}

/**
 * Get framework configuration
 */
export function getFrameworkConfig(framework: Framework): FrameworkConfig {
  return FRAMEWORK_CONFIGS[framework];
}

/**
 * Check if TypeScript is being used in the project
 */
export async function detectTypeScript(projectPath: string = process.cwd()): Promise<boolean> {
  const tsConfigPath = path.join(projectPath, 'tsconfig.json');
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  // Check for tsconfig.json
  if (await fs.pathExists(tsConfigPath)) {
    return true;
  }
  
  // Check for TypeScript in dependencies
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJson(packageJsonPath);
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      return !!(allDeps.typescript || allDeps['@types/node']);
    } catch (error) {
      return false;
    }
  }
  
  return false;
}

/**
 * Create project configuration
 */
export async function createProjectConfig(
  projectPath: string = process.cwd(),
  overrides: Partial<ProjectConfig> = {}
): Promise<ProjectConfig> {
  const framework = await detectFramework(projectPath);
  const typescript = await detectTypeScript(projectPath);
  const frameworkConfig = getFrameworkConfig(framework);
  
  return {
    framework,
    logoDirectory: frameworkConfig.defaultDirectory,
    importStyle: frameworkConfig.importStyle,
    typescript,
    exportFile: frameworkConfig.defaultExportFile,
    generateComponent: frameworkConfig.generateComponent,
    version: '1.0.0',
    ...overrides
  };
}

/**
 * Load project configuration from logocn.config.json
 */
export async function loadProjectConfig(projectPath: string = process.cwd()): Promise<ProjectConfig | null> {
  const configPath = path.join(projectPath, 'logocn.config.json');
  
  if (await fs.pathExists(configPath)) {
    try {
      return await fs.readJson(configPath);
    } catch (error) {
      console.warn('Failed to load project config, using defaults');
    }
  }
  
  return null;
}

/**
 * Save project configuration to logocn.config.json
 */
export async function saveProjectConfig(
  config: ProjectConfig, 
  projectPath: string = process.cwd()
): Promise<void> {
  const configPath = path.join(projectPath, 'logocn.config.json');
  await fs.writeJson(configPath, config, { spaces: 2 });
}

/**
 * Check if the project has been initialized
 */
export async function isProjectInitialized(projectPath: string = process.cwd()): Promise<boolean> {
  const configPath = path.join(projectPath, 'logocn.config.json');
  return fs.pathExists(configPath);
}

/**
 * Get the effective logo directory (from project config or global config)
 */
export async function getEffectiveLogoDirectory(projectPath: string = process.cwd()): Promise<string> {
  const projectConfig = await loadProjectConfig(projectPath);
  
  if (projectConfig) {
    return path.join(projectPath, projectConfig.logoDirectory);
  }
  
  // Fall back to global config (existing behavior)
  const { getLogoDirectory } = await import('./config.js');
  return getLogoDirectory();
}