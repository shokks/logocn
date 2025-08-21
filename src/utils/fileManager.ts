import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export class FileManager {
  /**
   * Save SVG content to file
   */
  async saveSVG(
    content: string, 
    fileName: string, 
    directory: string
  ): Promise<string> {
    // Ensure directory exists
    await fs.ensureDir(directory);
    
    // Clean filename (remove .svg if provided, we'll add it)
    const cleanName = fileName.replace(/\.svg$/i, '');
    const filePath = path.join(directory, `${cleanName}.svg`);
    
    // Check if file exists
    const exists = await fs.pathExists(filePath);
    if (exists) {
      console.log(chalk.yellow(`⚠  File already exists: ${path.relative(process.cwd(), filePath)}`));
      // In future, could prompt for overwrite
    }
    
    // Write file
    await fs.writeFile(filePath, content, 'utf-8');
    
    return filePath;
  }
  
  /**
   * Ensure a directory exists
   */
  async ensureDirectory(directory: string): Promise<void> {
    await fs.ensureDir(directory);
  }
  
  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    return fs.pathExists(filePath);
  }
  
  /**
   * Get relative path from current working directory
   */
  getRelativePath(filePath: string): string {
    return path.relative(process.cwd(), filePath);
  }
  
  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<void> {
    if (await this.fileExists(filePath)) {
      await fs.remove(filePath);
    }
  }
}