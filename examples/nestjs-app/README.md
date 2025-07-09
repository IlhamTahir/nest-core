# NestJS Example App

这是一个示例 NestJS 应用程序，演示如何使用 `@ilhamtahir/nest-core` 包。

## ✨ 功能特性

- 使用 `@ilhamtahir/nest-core` 包（通过 workspace 依赖）
- 演示模块导入和服务注入
- 提供完整的企业级功能示例
- 包含用户管理、角色权限、菜单管理、文件上传等功能

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- MySQL 数据库
- PNPM >= 8.0.0

### 配置数据库

1. 创建 MySQL 数据库：
```sql
CREATE DATABASE nest_core_example CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 在项目根目录创建 `.env` 文件：
```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=nest_core_example

# JWT 配置
JWT_SECRET=your-super-secret-key-for-example
JWT_EXPIRATION=7d

# Snowflake ID 配置（可选）
SNOWFLAKE_WORKER_ID=1
SNOWFLAKE_DATACENTER_ID=1

# 文件上传配置
UPLOAD_DIR=uploads
```

### 启动应用

```bash
# 安装依赖
pnpm install

# 启动开发模式
pnpm dev

# 或者构建后启动
pnpm build
pnpm start
```

## 📚 可用接口

### 🔐 认证接口

- `POST /tokens` - 用户登录获取 JWT 令牌

### 👥 用户管理接口

- `GET /users` - 获取用户列表（分页）
- `POST /users` - 创建新用户
- `GET /users/{id}` - 获取用户详情
- `PUT /users/{id}` - 更新用户信息
- `DELETE /users/{id}` - 删除用户
- `PUT /users/{id}/roles` - 设置用户角色

### 🛡️ 角色管理接口

- `GET /roles` - 获取角色列表（分页）
- `POST /roles` - 创建新角色
- `GET /roles/{id}` - 获取角色详情
- `PUT /roles/{id}` - 更新角色信息
- `DELETE /roles/{id}` - 删除角色
- `PUT /roles/{id}/menus` - 分配角色菜单权限

### 📋 菜单管理接口

- `GET /menu` - 获取菜单列表（分页）
- `GET /menu/tree` - 获取菜单树结构
- `GET /menu/user-menus` - 获取当前用户菜单
- `POST /menu` - 创建新菜单
- `GET /menu/{id}` - 获取菜单详情
- `PUT /menu/{id}` - 更新菜单信息
- `DELETE /menu/{id}` - 删除菜单

### 📁 文件管理接口

- `POST /files/upload` - 简单文件上传
- `POST /files/init` - 初始化分片上传
- `POST /files/{id}/finish` - 完成文件上传
- `GET /files/{id}` - 获取文件信息

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
