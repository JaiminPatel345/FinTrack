# Scripts

This directory contains utility scripts for the Expense Management System.

## Available Scripts

### 🚀 setup.sh
**Automated project setup script**

Handles complete project initialization including:
- Prerequisite checks (Node.js, Yarn, PostgreSQL, MongoDB, Python)
- Dependency installation for all services
- Environment file setup
- Database setup instructions

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Or using yarn:
```bash
yarn setup
```

### ✅ check-build.sh
**TypeScript compilation check**

Uses `yarn tsc --noEmit` to perform static type checking without building. This is the recommended way to check for TypeScript errors before running services.

```bash
./scripts/check-build.sh
```

Or using yarn:
```bash
yarn check:build
yarn typecheck  # alias
```

**Features:**
- Checks all 8 TypeScript services
- Uses static analysis (fast and safe)
- Color-coded output
- Detailed error reporting
- Summary statistics

### 🔍 check-typescript.sh
**Runtime TypeScript check**

Uses `yarn tsx` to attempt running each service, catching runtime compilation errors. Useful after dependencies are installed.

```bash
./scripts/check-typescript.sh
```

Or using yarn:
```bash
yarn check:typescript
```

**Features:**
- Runs TypeScript services with tsx
- Catches runtime errors
- Tests actual service execution
- Color-coded results

## Usage Recommendations

1. **Initial Setup**: Run `./scripts/setup.sh` first
2. **Type Checking**: Use `yarn check:build` regularly during development
3. **Runtime Verification**: Use `yarn check:typescript` after installing dependencies

## Script Permissions

All scripts need execute permissions. If you get a permission error:

```bash
chmod +x scripts/*.sh
```

## Integration with package.json

These scripts are integrated into the root `package.json`:

- `yarn setup` → `./scripts/setup.sh`
- `yarn check:build` → `./scripts/check-build.sh`
- `yarn typecheck` → `./scripts/check-build.sh`
- `yarn check:typescript` → `./scripts/check-typescript.sh`

## Development

When adding new scripts:

1. Place them in this directory
2. Make them executable: `chmod +x scripts/your-script.sh`
3. Add them to `package.json` for easy access
4. Document them in this README
5. Use clear, descriptive names

## Notes

- All scripts assume they are run from the project root
- Scripts use colored output for better readability
- Error handling includes helpful suggestions
- Scripts are designed to be idempotent where possible
