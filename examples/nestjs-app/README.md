# NestJS Example App

This is an example NestJS application that demonstrates how to use the `@ilhamtahir/nest-core` package.

## Features

- Uses `@ilhamtahir/nest-core` package via workspace dependency
- Demonstrates module import and service injection
- Provides both core package endpoints and custom app endpoints

## Available Endpoints

- `GET /` - Hello message from core package
- `GET /app` - Hello message from example app
- `GET /info` - Detailed information from core package
- `GET /core` - Core package hello endpoint
- `GET /core/version` - Core package version
- `GET /core/info` - Core package detailed info

## Development

From the workspace root:

```bash
# Start in development mode
pnpm dev:example

# Build the app
pnpm build:example

# Run tests
pnpm --filter nestjs-example test
```

## Local Development

```bash
# Install dependencies
pnpm install

# Start in watch mode
pnpm dev

# Build
pnpm build

# Start production
pnpm start
```

## Usage Example

The app demonstrates how to import and use the core module:

```typescript
import { Module } from '@nestjs/common';
import { CoreModule } from '@ilhamtahir/nest-core';

@Module({
  imports: [CoreModule],
  // ... other configuration
})
export class AppModule {}
```

And how to inject the core service:

```typescript
import { Controller, Get } from '@nestjs/common';
import { CoreService } from '@ilhamtahir/nest-core';

@Controller()
export class AppController {
  constructor(private readonly coreService: CoreService) {}

  @Get()
  getHello(): string {
    return this.coreService.getHello();
  }
}
```
