#!/bin/bash

# 初始化脚本 - 创建管理员账户

echo "正在初始化数据库..."
npx prisma migrate dev --name init

echo "正在生成 Prisma 客户端..."
npx prisma generate

echo "启动应用..."
npm run dev
