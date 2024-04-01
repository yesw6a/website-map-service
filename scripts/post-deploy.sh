#!/bin/bash

# 定义文件路径
FILE="src/index.ts"

# 检查文件是否存在
if [ ! -f "$FILE" ]; then
  echo "File does not exist: $FILE"
  exit 1
fi

# 使用sed命令取消注释指定的导入语句
sed -i.bak "s/^\/\/ \(import { DevInitCF } from '.\/endpoints\/dev-init-cf';\)/\1/" "$FILE"

# 使用sed命令取消注释指定的路由语句
sed -i.bak "s/^\/\/ \(router.get('\/api\/dev\/init', DevInitCF);\)/\1/" "$FILE"

echo "Import and route statements have been uncommented."

# 删除备份文件
rm "${FILE}.bak"
