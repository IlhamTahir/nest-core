#!/bin/bash

# 修复所有导入路径问题
echo "🔧 修复所有导入路径问题..."

cd packages/nest-core/src

# 修复相对路径导入问题
echo "修复相对路径导入..."

# 修复 ./dto/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./dto/|from '\''../dto/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./dto/|from "../dto/|g' {} \;

# 修复 ./vo/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./vo/|from '\''../vo/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./vo/|from "../vo/|g' {} \;

# 修复 ./entity/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./entity/|from '\''../entity/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./entity/|from "../entity/|g' {} \;

# 修复 ./service/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./service/|from '\''../service/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./service/|from "../service/|g' {} \;

# 修复 ./mapper/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./mapper/|from '\''../mapper/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./mapper/|from "../mapper/|g' {} \;

# 修复 ./enum/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./enum/|from '\''../enum/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./enum/|from "../enum/|g' {} \;

# 修复 ./exception/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./exception/|from '\''../exception/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./exception/|from "../exception/|g' {} \;

# 修复 ./error/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./error/|from '\''../error/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./error/|from "../error/|g' {} \;

# 修复 ./util/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./util/|from '\''../util/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./util/|from "../util/|g' {} \;

# 修复 ./decorators/ 路径
find . -name "*.ts" -type f -exec sed -i '' 's|from '\''./decorators/|from '\''../decorators/|g' {} \;
find . -name "*.ts" -type f -exec sed -i '' 's|from "./decorators/|from "../decorators/|g' {} \;

echo "✅ 导入路径修复完成！"
