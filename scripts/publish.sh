#!/bin/bash

# 发布脚本
# 用法: ./scripts/publish.sh

set -e

echo "🚀 开始发布流程..."

# 检查是否在正确的分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "❌ 请在 main 或 master 分支上发布"
    exit 1
fi

# 检查工作目录是否干净
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 工作目录不干净，请先提交所有更改"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 运行测试
echo "🧪 运行测试..."
pnpm test

# 运行 lint
echo "🔍 运行 lint..."
pnpm lint

# 构建核心包
echo "🔨 构建核心包..."
pnpm build:core

# 检查构建产物
if [ ! -d "packages/nest-core/dist" ]; then
    echo "❌ 构建失败，找不到 dist 目录"
    exit 1
fi

echo "✅ 所有检查通过！"
echo ""
echo "现在你可以："
echo "1. 运行 'pnpm changeset' 添加变更日志"
echo "2. 运行 'pnpm version-packages' 更新版本"
echo "3. 运行 'pnpm release' 发布到 npm"
echo ""
echo "或者手动发布："
echo "cd packages/nest-core && npm publish"
