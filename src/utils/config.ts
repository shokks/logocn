import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Config } from '../types/index.js';

const CONFIG_DIR = path.join(os.homedir(), '.logocn');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: Config = {
  logoDirectory: 'components/logos',
  useColor: true
};

/**
 * Load configuration from user's home directory
 */
export async function loadConfig(): Promise<Config> {
  try {
    await fs.ensureDir(CONFIG_DIR);
    if (await fs.pathExists(CONFIG_FILE)) {
      const config = await fs.readJson(CONFIG_FILE);
      return { ...DEFAULT_CONFIG, ...config };
    }
    await saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  } catch (error) {
    console.warn('Failed to load config, using defaults');
    return DEFAULT_CONFIG;
  }
}

/**
 * Save configuration to user's home directory
 */
export async function saveConfig(config: Config): Promise<void> {
  try {
    await fs.ensureDir(CONFIG_DIR);
    await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to save config: ${error}`);
  }
}

/**
 * Get the absolute path to the logo directory
 */
export async function getLogoDirectory(): Promise<string> {
  const config = await loadConfig();
  return path.join(process.cwd(), config.logoDirectory);
}

/**
 * Reset configuration to defaults
 */
export async function resetConfig(): Promise<void> {
  await saveConfig(DEFAULT_CONFIG);
}