#!/bin/bash

# 定义文件路径
FILE="src/index.ts"

# 检查文件是否存在
if [ ! -f "$FILE" ]; then
  echo "File does not exist: $FILE"
  exit 1
fi

# 使用sed命令注释指定的导入语句
sed -i.bak "/import { DevInitCF } from '.\/endpoints\/dev-init-cf';/s/^/\/\/ /" "$FILE"

# 使用sed命令注释指定的路由语句
sed -i.bak "/router.get('\/api\/dev\/init', DevInitCF);/s/^/\/\/ /" "$FILE"

echo "Import and route statements have been commented."

# 删除备份文件
rm "${FILE}.bak"
