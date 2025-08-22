# Contributing to LogoCN

Thank you for your interest in contributing to LogoCN! 

## How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on GitHub
- Clone your fork locally:
  ```bash
  git clone https://github.com/YOUR_USERNAME/logocn.git
  cd logocn
  ```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes
- Follow the existing code style
- Add tests if applicable
- Update documentation if needed

### 4. Test Your Changes
```bash
npm install
npm run build
npm link
logocn add react  # Test your changes
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature" 
# or "fix: resolve bug"
```

### 6. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request
- Go to your fork on GitHub
- Click "Pull Request"
- Describe your changes clearly
- Link any related issues

## Code Style

- Use TypeScript
- Follow existing patterns
- Keep it simple and readable

## What We Accept

✅ Bug fixes
✅ New logo source integrations
✅ Performance improvements
✅ Documentation improvements
✅ New features (discuss first in issues)

## What We Don't Accept

❌ Breaking changes without discussion
❌ Code without proper testing
❌ Features that complicate the simple CLI approach

## Questions?

Open an issue for discussion before making large changes.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.