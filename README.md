# NestJS Core Module Workspace

A monorepo workspace containing a reusable NestJS core module and example application.

## 📁 Project Structure

```
nest-core/
├── packages/
│   └── nest-core/          # Core NestJS module package
├── examples/
│   └── nestjs-app/         # Example NestJS application
├── pnpm-workspace.yaml     # PNPM workspace configuration
└── package.json            # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PNPM >= 8.0.0

### Installation

```bash
# Install dependencies for all packages
pnpm install
```

### Development

```bash
# Build the core package
pnpm build:core

# Run the example application in development mode
pnpm dev:example

# Build all packages
pnpm build
```

### Testing

```bash
# Run tests for all packages
pnpm test

# Run tests for core package only
pnpm test:core
```

## 📦 Packages

### @ilhamtahir/nest-core

A reusable NestJS module that provides:
- CoreService with basic functionality
- CoreController with REST API endpoints
- Full TypeScript support
- Comprehensive test coverage

### nestjs-example

An example NestJS application demonstrating how to use the `@ilhamtahir/nest-core` package.

## 🔧 Development Workflow

### 1. Making Changes to Core Package

```bash
# Navigate to core package
cd packages/nest-core

# Make your changes
# ...

# Build the package
pnpm build

# Run tests
pnpm test
```

### 2. Testing Changes in Example App

```bash
# The example app uses workspace:* dependency
# Changes to core package are automatically available

# Run the example app
pnpm dev:example
```

### 3. Version Management

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Add a changeset (describes your changes)
pnpm changeset

# Version packages (updates package.json versions)
pnpm version-packages

# Build and publish
pnpm release
```

## 📋 Available Scripts

### Root Level Scripts

- `pnpm build` - Build all packages
- `pnpm build:core` - Build core package only
- `pnpm build:example` - Build example app only
- `pnpm dev:example` - Run example app in development mode
- `pnpm start:example` - Run example app in production mode
- `pnpm test` - Run tests for all packages
- `pnpm test:core` - Run tests for core package only
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all packages
- `pnpm clean` - Clean all build outputs
- `pnpm publish:core` - Publish core package to npm
- `pnpm changeset` - Add a changeset
- `pnpm version-packages` - Version packages
- `pnpm release` - Build and publish packages

## 🌐 API Endpoints (Example App)

When running the example app, the following endpoints are available:

- `GET /` - Hello message from core package
- `GET /app` - Hello message from example app
- `GET /info` - Detailed information from core package
- `GET /core` - Core package hello endpoint
- `GET /core/version` - Core package version
- `GET /core/info` - Core package detailed info

## 📝 Publishing

### Manual Publishing

```bash
# 1. Build the core package
pnpm build:core

# 2. Navigate to core package
cd packages/nest-core

# 3. Publish to npm
npm publish
```

### Automated Publishing with Changesets

```bash
# 1. Add changeset describing your changes
pnpm changeset

# 2. Version packages (this updates package.json versions)
pnpm version-packages

# 3. Build and publish
pnpm release
```

## 🤝 Contributing

1. Make your changes
2. Add tests if necessary
3. Run `pnpm test` to ensure all tests pass
4. Run `pnpm lint` to check code style
5. Add a changeset with `pnpm changeset`
6. Submit a pull request

## 📄 License

MIT
