import chalk from 'chalk';
import figlet from 'figlet';

/**
 * Create a beautiful gradient effect for text
 */
function gradientText(text: string): string {
  const lines = text.split('\n');
  const colors = [
    chalk.hex('#10b981'), // Emerald 500 (matching logo.svg)
    chalk.hex('#34d399'), // Emerald 400
    chalk.hex('#6ee7b7'), // Emerald 300
    chalk.hex('#a7f3d0'), // Emerald 200
    chalk.hex('#d1fae5'), // Emerald 100
    chalk.hex('#ecfdf5'), // Emerald 50
  ];
  
  return lines.map((line, index) => {
    const colorIndex = Math.min(index, colors.length - 1);
    return colors[colorIndex](line);
  }).join('\n');
}

/**
 * Display the premium LogoCN banner
 */
export function displayBanner(): void {
  console.log();
  
  // Create the main logo with a bold, modern font
  const logo = figlet.textSync('LogoCN', {
    font: 'ANSI Shadow',
    horizontalLayout: 'fitted',
    verticalLayout: 'default'
  });
  
  // Apply gradient effect
  console.log(gradientText(logo));
  
  // Add a stylish underline
  const width = logo.split('\n')[0].length;
  console.log(chalk.hex('#059669')('━'.repeat(Math.min(width, 60)))); // Emerald 600
  
  // Add tagline with custom styling
  console.log();
  console.log(
    chalk.hex('#10b981')('  ✨ ') + 
    chalk.bold.white('Add SVG logos to your project ') +
    chalk.hex('#10b981')('with style')
  );
  console.log(
    chalk.hex('#059669')('  ⚡ ') + 
    chalk.gray('3,300+ icons • ') +
    chalk.hex('#34d399')('Simple Icons CDN • ') +
    chalk.gray('Zero config')
  );
  console.log();
}

/**
 * Display a compact version of the banner (for non-init commands)
 */
export function displayCompactBanner(): void {
  const text = 'LogoCN';
  const gradient = [
    chalk.hex('#10b981'), // Emerald 500
    chalk.hex('#059669'), // Emerald 600
    chalk.hex('#047857'), // Emerald 700
  ];
  
  const colored = text.split('').map((char, i) => {
    const colorIndex = Math.floor((i / text.length) * gradient.length);
    return gradient[Math.min(colorIndex, gradient.length - 1)](char);
  }).join('');
  
  console.log();
  console.log('  ' + colored + chalk.gray(' • Add SVG logos with style'));
  console.log();
}

/**
 * Display success banner
 */
export function displaySuccessBanner(): void {
  const checkmark = chalk.greenBright('✓');
  const text = 'Success!';
  
  console.log();
  console.log(chalk.bold(`  ${checkmark} ${chalk.green(text)}`));
  console.log(chalk.gray('  ─────────────'));
}

/**
 * Create a boxed message
 */
export function boxMessage(title: string, lines: string[]): void {
  const maxLength = Math.max(
    title.length,
    ...lines.map(line => line.replace(/\x1b\[[0-9;]*m/g, '').length)
  );
  
  const width = Math.min(maxLength + 4, 60);
  
  // Top border
  console.log(chalk.hex('#10b981')('  ╭' + '─'.repeat(width - 2) + '╮'));
  
  // Title
  const titlePadding = Math.floor((width - 4 - title.length) / 2);
  console.log(
    chalk.hex('#10b981')('  │') + 
    ' '.repeat(titlePadding) + 
    chalk.bold.white(title) + 
    ' '.repeat(width - 4 - titlePadding - title.length) + 
    chalk.hex('#10b981')('│')
  );
  
  // Separator
  console.log(chalk.hex('#10b981')('  ├' + '─'.repeat(width - 2) + '┤'));
  
  // Content lines
  lines.forEach(line => {
    const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '');
    const padding = width - 4 - cleanLine.length;
    console.log(
      chalk.hex('#10b981')('  │ ') + 
      line + 
      ' '.repeat(Math.max(0, padding)) + 
      chalk.hex('#10b981')(' │')
    );
  });
  
  // Bottom border
  console.log(chalk.hex('#10b981')('  ╰' + '─'.repeat(width - 2) + '╯'));
}