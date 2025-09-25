# Commit Guidelines

This project uses **Commitizen** with emoji support for standardized commits.

## Quick Start

Instead of `git commit`, use:

```bash
npm run commit
```

This will launch an interactive prompt to help you create properly formatted commits with emojis.

## Commit Types

| Type         | Emoji                      | Description                 |
| ------------ | -------------------------- | --------------------------- |
| **feat**     | ✨ `:sparkles:`            | Introducing new features    |
| **fix**      | 🐛 `:bug:`                 | Fixing a bug                |
| **docs**     | 📚 `:books:`               | Writing docs                |
| **style**    | 💄 `:lipstick:`            | Updating UI and style files |
| **refactor** | ♻️ `:recycle:`             | Refactoring code            |
| **perf**     | ⚡ `:zap:`                 | Improving performance       |
| **test**     | ✅ `:white_check_mark:`    | Adding tests                |
| **build**    | 🔨 `:hammer:`              | Updating build scripts      |
| **ci**       | 👷 `:construction_worker:` | Adding CI build system      |
| **chore**    | 🔧 `:wrench:`              | Configuration changes       |
| **revert**   | ⏪ `:rewind:`              | Reverting changes           |

## Available Scopes

- `web` - Web application changes
- `api` - API related changes
- `ui` - UI components and design
- `auth` - Authentication related
- `database` - Database changes
- `config` - Configuration updates
- `deps` - Dependency updates
- `docs` - Documentation changes

## Pre-commit Hooks

The following tools will automatically run before each commit:

- **Lint-staged**: Runs linting and formatting on staged files
- **Commitlint**: Validates commit message format

## Example Commits

```
✨ feat(auth): add OAuth login integration
🐛 fix(ui): resolve button alignment issue
📚 docs: update installation guide
♻️ refactor(api): optimize user data fetching
⚡ perf(web): improve page load time
```

## Manual Commit Format

If you prefer to write commits manually, follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```
