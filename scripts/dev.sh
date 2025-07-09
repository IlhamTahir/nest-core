#!/bin/bash

# 开发脚本
# 用法: ./scripts/dev.sh

set -e

echo "🚀 启动开发环境..."

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建核心包
echo "🔨 构建核心包..."
pnpm build:core

# 启动示例应用
echo "🌟 启动示例应用..."
echo "应用将在 http://localhost:3000 启动"
echo ""
echo "可用的 API 端点："
echo "  GET /          - Hello from core package"
echo "  GET /app       - Hello from example app"
echo "  GET /info      - Detailed info from core package"
echo "  GET /core      - Core package hello endpoint"
echo "  GET /core/version - Core package version"
echo "  GET /core/info - Core package detailed info"
echo ""

pnpm dev:example
