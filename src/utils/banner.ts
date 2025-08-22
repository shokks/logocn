import chalk from 'chalk';
import figlet from 'figlet';

/**
 * Create a beautiful gradient effect for text
 */
function gradientText(text: string): string {
  const lines = text.split('\n');
  const colors = [
    chalk.hex('#00D9FF'), // Bright cyan
    chalk.hex('#00C4E6'), // Cyan
    chalk.hex('#00AFCC'), // Darker cyan
    chalk.hex('#0099B3'), // Even darker cyan
    chalk.hex('#008499'), // Deep cyan
    chalk.hex('#006F80'), // Deepest cyan
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
  console.log(chalk.hex('#006F80')('━'.repeat(Math.min(width, 60))));
  
  // Add tagline with custom styling
  console.log();
  console.log(
    chalk.hex('#00D9FF')('  ✨ ') + 
    chalk.bold.white('Add SVG logos to your project ') +
    chalk.hex('#00D9FF')('with style')
  );
  console.log(
    chalk.hex('#0099B3')('  ⚡ ') + 
    chalk.gray('2,800+ icons • ') +
    chalk.hex('#00C4E6')('Simple Icons CDN • ') +
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
    chalk.hex('#00D9FF'),
    chalk.hex('#00AFCC'),
    chalk.hex('#008499'),
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
  console.log(chalk.hex('#00D9FF')('  ╭' + '─'.repeat(width - 2) + '╮'));
  
  // Title
  const titlePadding = Math.floor((width - 4 - title.length) / 2);
  console.log(
    chalk.hex('#00D9FF')('  │') + 
    ' '.repeat(titlePadding) + 
    chalk.bold.white(title) + 
    ' '.repeat(width - 4 - titlePadding - title.length) + 
    chalk.hex('#00D9FF')('│')
  );
  
  // Separator
  console.log(chalk.hex('#00D9FF')('  ├' + '─'.repeat(width - 2) + '┤'));
  
  // Content lines
  lines.forEach(line => {
    const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '');
    const padding = width - 4 - cleanLine.length;
    console.log(
      chalk.hex('#00D9FF')('  │ ') + 
      line + 
      ' '.repeat(Math.max(0, padding)) + 
      chalk.hex('#00D9FF')(' │')
    );
  });
  
  // Bottom border
  console.log(chalk.hex('#00D9FF')('  ╰' + '─'.repeat(width - 2) + '╯'));
}