#!/bin/bash

# 修复 VO 文件中的语法错误
echo "🔧 修复 VO 文件语法错误..."

cd packages/nest-core/src

# 修复所有 VO 文件中的残留代码
find vo -name "*.ts" -exec sed -i '' '/^  name:/d' {} \;
find vo -name "*.ts" -exec sed -i '' '/^  description:/d' {} \;
find vo -name "*.ts" -exec sed -i '' '/^})$/d' {} \;

# 修复 DTO 文件中的残留代码
find dto -name "*.ts" -exec sed -i '' '/^  name:/d' {} \;
find dto -name "*.ts" -exec sed -i '' '/^  description:/d' {} \;
find dto -name "*.ts" -exec sed -i '' '/^})$/d' {} \;

echo "✅ VO 文件修复完成！"
