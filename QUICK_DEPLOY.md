# 🚀 职场嘴替助手 - 快速部署指南

## 📋 DeepSeek API Key
请在 `.env` 文件中配置你的 DeepSeek API Key

---

## 🎯 快速部署（3步搞定）

### 在 Linux 服务器上执行：

#### 1️⃣ 准备环境

```bash
# 安装 Node.js 18+ (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2 serve

# 验证安装
node -v
npm -v
pm2 -v
```

#### 2️⃣ 上传并启动项目

```bash
# 进入项目目录
cd /var/www/workplace-assistant  # 或你的项目目录

# 1. 安装依赖
npm install

# 2. 配置环境变量（第一次需要）
cp .env.example .env
nano .env  # 填入你的 DeepSeek API Key

# 3. 构建前端
npm run build

# 4. 启动服务
./start.sh  # 或者手动执行：pm2 start ecosystem.config.js
```

#### 3️⃣ 验证部署

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs workplace-api
pm2 logs workplace-web

# 访问网站
# http://your-server-ip:5173
```

---

## 📝 已创建的文件

| 文件 | 用途 |
|------|------|
| [DEPLOY.md](DEPLOY.md) | 完整部署文档 |
| [QUICK_DEPLOY.md](QUICK_DEPLOY.md) | 快速部署指南 |
| [ecosystem.config.js](ecosystem.config.js) | PM2 配置文件 |
| [.env.example](.env.example) | 环境变量示例 |
| [start.sh](start.sh) | 一键启动脚本 |
| [.gitignore](.gitignore) | Git 忽略配置 |

---

## 🔧 常用命令

### PM2 操作
```bash
pm2 status                    # 查看状态
pm2 logs workplace-api        # 后端日志
pm2 logs workplace-web        # 前端日志
pm2 restart all               # 重启所有
pm2 stop all                  # 停止所有
pm2 delete all                # 删除所有
pm2 save                      # 保存配置
pm2 startup                   # 开机自启
```

### 系统操作
```bash
# 查看端口占用
lsof -ti :3001 | xargs -r kill -9
lsof -ti :5173 | xargs -r kill -9

# 查看资源使用
htop
```

---

## 🛡️ 生产环境建议

### 1. 使用 Nginx 反向代理

```bash
# 安装 Nginx
sudo apt install nginx

# 配置（详见 DEPLOY.md）
sudo nano /etc/nginx/sites-available/workplace-assistant
```

### 2. 启用 HTTPS

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 3. 配置防火墙

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## ❓ 常见问题

### Q: 服务无法启动？
```bash
# 检查端口
lsof -ti :3001 | xargs -r kill -9
lsof -ti :5173 | xargs -r kill -9

# 重新启动
pm2 restart all
```

### Q: API Key 在哪里配置？
```bash
# 编辑 .env 文件
nano .env
# 修改：DEEPSEEK_API_KEY=你的新Key
# 保存后重启：pm2 restart all
```

### Q: 如何更新代码？
```bash
git pull  # 如果用 Git
npm install
npm run build
pm2 restart all
```

---

## 📞 需要帮助？

详细说明请查看 [DEPLOY.md](DEPLOY.md)
