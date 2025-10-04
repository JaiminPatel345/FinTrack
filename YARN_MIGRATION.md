# Yarn Migration Summary

This project now uses **Yarn** as the package manager instead of npm.

## What Changed

All npm commands have been replaced with yarn equivalents across:

### 1. Package Configuration
- ✅ `package.json` - Updated all scripts and engine requirements
- ✅ Changed `"npm": ">=9.0.0"` to `"yarn": ">=1.22.0"`

### 2. Scripts
- ✅ `setup.sh` - Uses `yarn install` instead of `npm install`
- ✅ `check-typescript.sh` - Uses `yarn tsx` instead of `npx tsx`
- ✅ `check-build.sh` - Uses `yarn tsc` instead of `npx tsc`

### 3. Documentation
- ✅ `README.md` - All commands updated
- ✅ `SETUP.md` - Prerequisites and instructions updated
- ✅ `QUICK_REFERENCE.md` - All command references updated
- ✅ `server/README.md` - Service-specific commands updated

## Quick Reference

### Command Equivalents

| npm Command | Yarn Command |
|------------|--------------|
| `npm install` | `yarn install` |
| `npm run install:all` | `yarn install:all` |
| `npm run dev:gateway` | `yarn dev:gateway` |
| `npm run build:all` | `yarn build:all` |
| `npm run check:build` | `yarn check:build` |
| `npm test` | `yarn test` |
| `npx tsx <file>` | `yarn tsx <file>` |
| `npx tsc --noEmit` | `yarn tsc --noEmit` |
| `npm install -g <package>` | `yarn global add <package>` |

### Getting Started

1. **Install Yarn** (if not already installed):
   ```bash
   npm install -g yarn
   ```

2. **Install all dependencies**:
   ```bash
   yarn install:all
   ```

3. **Run build check**:
   ```bash
   yarn check:build
   # or
   ./check-build.sh
   ```

4. **Start services**:
   ```bash
   yarn dev:gateway
   yarn dev:auth
   # etc...
   ```

## Why Yarn?

- **Faster**: Parallel installation and caching
- **Reliable**: Lockfile ensures consistent dependencies
- **Workspaces**: Better monorepo support
- **Deterministic**: Same dependencies across all environments

## Important Notes

- The only remaining npm reference is in `setup.sh` for yarn installation: `npm install -g yarn` (this is intentional for bootstrapping)
- All workspaces in the `server/` directory now use yarn
- Docker containers will use yarn for dependency installation
- CI/CD pipelines should be updated to use yarn

## Verification

Check that everything is working:

```bash
# Verify yarn is installed
yarn --version

# Install dependencies
yarn install:all

# Run TypeScript checks
yarn check:build

# Start a service
yarn dev:auth
```

---
**Migration Date**: October 4, 2025
**Status**: ✅ Complete
