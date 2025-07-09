# @ilhamtahir/nest-core

A reusable NestJS core module package.

## Installation

```bash
npm install @ilhamtahir/nest-core
# or
yarn add @ilhamtahir/nest-core
# or
pnpm add @ilhamtahir/nest-core
```

## Usage

```typescript
import { Module } from '@nestjs/common';
import { CoreModule } from '@ilhamtahir/nest-core';

@Module({
  imports: [CoreModule],
})
export class AppModule {}
```

## Features

- CoreService: Provides basic functionality
- CoreController: REST API endpoints
- Fully typed with TypeScript
- Comprehensive test coverage

## API

### CoreService

- `getHello()`: Returns a hello message
- `getVersion()`: Returns the package version
- `getInfo()`: Returns detailed information object

### CoreController

- `GET /core`: Returns hello message
- `GET /core/version`: Returns version
- `GET /core/info`: Returns detailed info

## Development

See the main workspace README for development instructions.

## License

MIT
