#!/bin/bash

# 修复导入路径脚本
# 将 @/core/ 替换为相对路径

echo "🔧 修复导入路径..."

cd packages/nest-core/src

# 修复所有 TypeScript 文件中的导入路径
find . -name "*.ts" -type f -exec sed -i '' 's|@/core/|./|g' {} \;

echo "✅ 导入路径修复完成！"
