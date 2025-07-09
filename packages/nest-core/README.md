# @ilhamtahir/nest-core

一个功能完整的 NestJS 核心模块，提供用户管理、角色权限、菜单管理、文件上传、JWT 认证等企业级功能。

## 🚀 快速开始

### 安装

```bash
npm install @ilhamtahir/nest-core
# 或
yarn add @ilhamtahir/nest-core
# 或
pnpm add @ilhamtahir/nest-core
```

### 基本使用

```typescript
import { Module } from '@nestjs/common';
import { CoreModule } from '@ilhamtahir/nest-core';

@Module({
  imports: [CoreModule],
})
export class AppModule {}
```

### 环境配置

在项目根目录创建 `.env` 文件：

```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=nest_core

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# Snowflake ID 配置（可选，默认值为 1）
SNOWFLAKE_WORKER_ID=1
SNOWFLAKE_DATACENTER_ID=1

# 文件上传配置
UPLOAD_DIR=uploads

# AWS S3 配置（可选，用于文件上传到 S3）
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

## ✨ 核心功能

### 🔐 认证与授权
- JWT 令牌认证
- 基于角色的权限控制 (RBAC)
- 用户登录/注销
- 密码加密存储

### 👥 用户管理
- 用户 CRUD 操作
- 用户角色分配
- 用户状态管理（启用/禁用）
- 分页查询

### 🛡️ 角色权限
- 角色 CRUD 操作
- 角色菜单权限分配
- 动态权限验证

### 📋 菜单管理
- 树形菜单结构
- 菜单权限控制
- 动态菜单加载

### 📁 文件管理
- 本地文件上传
- AWS S3 文件上传
- 文件元数据管理
- 文件访问控制

### 🔧 工具功能
- Snowflake ID 生成器
- 全局异常处理
- 数据验证管道
- 请求上下文管理

## 📚 API 文档

### 🔐 认证接口

#### 登录获取令牌
```http
POST /tokens
Content-Type: application/json

{
  "identifier": "admin",
  "password": "123456"
}
```

**响应:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 👥 用户管理接口

#### 获取用户列表
```http
GET /users?page=1&size=10&username=admin
Authorization: Bearer <token>
```

#### 创建用户
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "nickname": "New User"
}
```

#### 获取用户详情
```http
GET /users/{id}
Authorization: Bearer <token>
```

#### 更新用户
```http
PUT /users/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "nickname": "Updated Name",
  "email": "updated@example.com"
}
```

#### 删除用户
```http
DELETE /users/{id}
Authorization: Bearer <token>
```

#### 设置用户角色
```http
PUT /users/{id}/roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "roleIds": ["role1", "role2"]
}
```

### 🛡️ 角色管理接口

#### 获取角色列表
```http
GET /roles?page=1&size=10
Authorization: Bearer <token>
```

#### 创建角色
```http
POST /roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Editor",
  "description": "内容编辑者"
}
```

#### 分配角色菜单权限
```http
PUT /roles/{id}/menus
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuIds": ["menu1", "menu2", "menu3"]
}
```

### 📋 菜单管理接口

#### 获取菜单树
```http
GET /menu/tree
Authorization: Bearer <token>
```

#### 获取当前用户菜单
```http
GET /menu/user-menus
Authorization: Bearer <token>
```

#### 创建菜单
```http
POST /menu
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "用户管理",
  "path": "/users",
  "component": "UserList",
  "icon": "user",
  "type": "MENU",
  "parentId": null,
  "sort": 1
}
```

### 📁 文件管理接口

#### 简单文件上传
```http
POST /files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary-file>
```

**响应:**
```json
{
  "url": "http://localhost:3000/uploads/filename.jpg"
}
```

#### 初始化分片上传
```http
POST /files/init
Authorization: Bearer <token>
Content-Type: application/json

{
  "filename": "large-file.zip",
  "size": 1048576,
  "contentType": "application/zip"
}
```

## ⚙️ 配置说明

### 环境变量详解

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NODE_ENV` | 否 | development | 运行环境 |
| `PORT` | 否 | 3000 | 应用端口 |
| `DB_HOST` | 是 | - | 数据库主机 |
| `DB_PORT` | 是 | - | 数据库端口 |
| `DB_USERNAME` | 是 | - | 数据库用户名 |
| `DB_PASSWORD` | 是 | - | 数据库密码 |
| `DB_NAME` | 是 | - | 数据库名称 |
| `JWT_SECRET` | 否 | default-secret | JWT 密钥 |
| `JWT_EXPIRATION` | 否 | 7d | JWT 过期时间 |
| `SNOWFLAKE_WORKER_ID` | 否 | 1 | Snowflake 工作节点 ID |
| `SNOWFLAKE_DATACENTER_ID` | 否 | 1 | Snowflake 数据中心 ID |
| `UPLOAD_DIR` | 否 | uploads | 文件上传目录 |
| `AWS_ACCESS_KEY_ID` | 否 | - | AWS 访问密钥 |
| `AWS_SECRET_ACCESS_KEY` | 否 | - | AWS 秘密密钥 |
| `AWS_REGION` | 否 | - | AWS 区域 |
| `AWS_S3_BUCKET` | 否 | - | S3 存储桶名称 |

## 🔧 高级用法

### 自定义服务注入

```typescript
import { Injectable } from '@nestjs/common';
import { UserService, AuthService } from '@ilhamtahir/nest-core';

@Injectable()
export class CustomService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async customLogic() {
    const users = await this.userService.findAll();
    // 自定义业务逻辑
  }
}
```

### 扩展实体

```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@ilhamtahir/nest-core';

@Entity()
export class CustomEntity extends BaseEntity {
  @Column()
  customField: string;

  @Column({ nullable: true })
  description?: string;
}
```

## 🚀 快速启动

### 1. 创建新项目

```bash
# 创建新的 NestJS 项目
nest new my-app
cd my-app

# 安装 nest-core 模块
pnpm add @ilhamtahir/nest-core
```

### 2. 配置应用模块

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { CoreModule } from '@ilhamtahir/nest-core';

@Module({
  imports: [CoreModule],
})
export class AppModule {}
```

### 3. 创建环境配置

```bash
# 在项目根目录创建 .env 文件
touch .env
```

```env
# .env
NODE_ENV=development
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT 配置
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=7d
```

### 4. 启动应用

```bash
pnpm start:dev
```

### 5. 访问 API

应用启动后，可以访问以下端点：

- **登录**: `POST http://localhost:3000/tokens`
- **用户管理**: `GET http://localhost:3000/users`
- **角色管理**: `GET http://localhost:3000/roles`
- **菜单管理**: `GET http://localhost:3000/menu`
- **文件上传**: `POST http://localhost:3000/files/upload`

### 默认管理员账户

首次启动时会自动创建管理员账户：
- **用户名**: `admin`
- **密码**: `123456`

## 🔍 故障排除

### 常见问题

#### 1. 数据库连接失败
```
Error: ER_ACCESS_DENIED_ERROR: Access denied for user
```
**解决方案**: 检查 `.env` 文件中的数据库配置是否正确。

#### 2. JWT 密钥警告
```
Warning: Using default JWT secret
```
**解决方案**: 在 `.env` 文件中设置 `JWT_SECRET` 环境变量。

#### 3. 文件上传失败
```
Error: ENOENT: no such file or directory
```
**解决方案**: 确保 `UPLOAD_DIR` 目录存在，或让应用自动创建。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**@ilhamtahir/nest-core** - 让 NestJS 开发更简单！ 🚀
