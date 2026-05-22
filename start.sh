#!/bin/bash

# 职场嘴替助手 - 启动脚本

echo "🚀 正在启动职场嘴替助手..."

# 创建日志目录
mkdir -p logs

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️ .env 文件不存在，正在创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑并填入你的 DeepSeek API Key"
fi

# 安装依赖
echo "📦 正在安装依赖..."
npm install

# 构建前端
echo "🔨 正在构建前端..."
npm run build

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "⚠️ PM2 未安装，正在安装..."
    npm install -g pm2
fi

# 检查 serve
if ! command -v serve &> /dev/null; then
    echo "⚠️ serve 未安装，正在安装..."
    npm install -g serve
fi

# 使用 PM2 启动服务
echo "🎯 正在使用 PM2 启动服务..."
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup

echo ""
echo "✅ 服务已启动！"
echo ""
echo "📊 服务状态："
pm2 status
echo ""
echo "🌐 访问地址："
echo "   前端：http://localhost:5173"
echo "   后端：http://localhost:3001"
echo ""
echo "📝 常用命令："
echo "   pm2 status           - 查看服务状态"
echo "   pm2 logs workplace-api - 查看后端日志"
echo "   pm2 logs workplace-web - 查看前端日志"
echo "   pm2 restart all     - 重启所有服务"
echo "   pm2 stop all        - 停止所有服务"
echo ""
