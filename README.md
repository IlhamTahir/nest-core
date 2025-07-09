# NestJS Core Module Workspace

一个包含可重用 NestJS 核心模块和示例应用程序的 monorepo 工作区。

## 📁 项目结构

```
nest-core/
├── packages/
│   └── nest-core/          # 核心 NestJS 模块包
├── examples/
│   └── nestjs-app/         # 示例 NestJS 应用程序
├── pnpm-workspace.yaml     # PNPM 工作区配置
└── package.json            # 根工作区配置
```

## ✨ 核心功能

### @ilhamtahir/nest-core 模块提供：

- 🔐 **完整的认证系统** - JWT 令牌认证，密码加密存储
- 👥 **用户管理** - 用户 CRUD，角色分配，状态管理
- 🛡️ **角色权限控制** - RBAC 权限模型，动态权限验证
- 📋 **菜单管理** - 树形菜单结构，权限控制
- 📁 **文件管理** - 本地/S3 文件上传，元数据管理
- 🔧 **企业级工具** - Snowflake ID 生成器，全局异常处理
- 🗄️ **数据库集成** - TypeORM + MySQL，自动表结构管理
- 📝 **API 文档** - Swagger 自动生成文档

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- PNPM >= 8.0.0
- MySQL >= 5.7

### 安装依赖

```bash
# 安装所有包的依赖
pnpm install
```

### 配置数据库

1. 创建 MySQL 数据库：
```sql
CREATE DATABASE nest_core_example CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 在 `examples/nestjs-app/` 目录下创建 `.env` 文件：
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
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=7d
```

### 开发

```bash
# 构建核心包
pnpm build:core

# 运行示例应用程序（开发模式）
pnpm dev:example

# 构建所有包
pnpm build
```

### 测试

```bash
# 运行所有包的测试
pnpm test

# 仅运行核心包测试
pnpm test:core
```

### 快速体验

1. 启动示例应用：
```bash
pnpm dev:example
```

2. 使用默认管理员账户登录：
   - 用户名: `admin`
   - 密码: `123456`

3. 获取 JWT 令牌：
```bash
curl -X POST http://localhost:3000/tokens \
  -H "Content-Type: application/json" \
  -d '{"identifier": "admin", "password": "123456"}'
```

4. 访问受保护的接口：
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
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

## 🌐 API 接口（示例应用）

运行示例应用时，可以访问以下接口：

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

## 🔧 环境变量配置

在使用 `@ilhamtahir/nest-core` 时，需要在项目根目录创建 `.env` 文件：

```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置（必需）
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT 配置
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=7d

# Snowflake ID 配置（可选）
SNOWFLAKE_WORKER_ID=1
SNOWFLAKE_DATACENTER_ID=1

# 文件上传配置
UPLOAD_DIR=uploads

# AWS S3 配置（可选）
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## 🚀 在新项目中使用

### 1. 安装包

```bash
npm install @ilhamtahir/nest-core
# 或
pnpm add @ilhamtahir/nest-core
```

### 2. 导入模块

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { CoreModule } from '@ilhamtahir/nest-core';

@Module({
  imports: [CoreModule],
})
export class AppModule {}
```

### 3. 配置环境变量

创建 `.env` 文件并配置数据库连接等信息。

### 4. 启动应用

```bash
npm run start:dev
```

应用启动后会自动：
- 创建数据库表结构
- 初始化管理员账户（admin/123456）
- 创建默认菜单结构

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发流程

1. 修改代码
2. 添加必要的测试
3. 运行 `pnpm test` 确保所有测试通过
4. 运行 `pnpm lint` 检查代码风格
5. 使用 `pnpm changeset` 添加变更记录
6. 提交 Pull Request

## 📄 许可证

MIT License

---

**@ilhamtahir/nest-core** - 企业级 NestJS 核心模块，让后端开发更简单！ 🚀
