#!/bin/bash
pnpm build

# 目标目录，需要清空并复制新内容
TARGET_DIR="/Users/lk/Documents/Dev/aims/xuanwu-logic/logic-solution/logic-ide/src/main/resources/public"

# 当前目录下的dist文件夹的绝对路径
SOURCE_DIR="$(pwd)/dist"

# 进入目标目录并清空其内容
cd "$TARGET_DIR" && {
  # 检查目录是否存在
  if [ -d "$TARGET_DIR" ]; then
    # 删除目录下的所有文件和文件夹
    echo "Cleaning up $TARGET_DIR..."
    rm -rf *
    echo "Cleanup complete."
  else
    echo "Target directory $TARGET_DIR does not exist."
    exit 1
  fi
}

# 复制当前目录下的dist文件夹到目标目录
echo "Copying $SOURCE_DIR to $TARGET_DIR"
cp -R "$SOURCE_DIR"/* "$TARGET_DIR"

# 检查复制是否成功
if [ $? -eq 0 ]; then
  echo "Copy successful."
else
  echo "Copy failed."
  exit 1
fi