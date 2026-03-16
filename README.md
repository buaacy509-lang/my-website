# 个人博客网站

基于 Next.js 14 + PostgreSQL + Prisma 构建的全栈个人博客系统。

## 功能特性

### 文章模块
- ✅ Markdown 编辑器支持
- ✅ 文章分类和标签管理
- ✅ 评论系统
- ✅ 阅读量统计
- ✅ 发布/草稿状态

### 问答模块
- ✅ 公开/私密提问
- ✅ 验证码保护（注册时使用）
- ✅ 管理员审核机制
- ✅ 问答回复功能

### 用户系统
- ✅ 邮箱注册/登录
- ✅ 角色权限管理（管理员/普通用户）
- ✅ JWT 会话管理

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **部署**: Docker, Docker Compose

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo>
cd my-website
```

### 2. 配置环境变量

复制 `.env.local` 为 `.env` 并配置：

```bash
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/mywebsite"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# 邮箱配置（用于验证码）
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-password"
EMAIL_FROM="noreply@example.com"
```

### 3. 使用 Docker 运行

```bash
# 启动服务
docker-compose up -d

# 首次运行需要初始化数据库
docker-compose exec app npx prisma migrate dev

# 创建管理员账户
docker-compose exec app npx prisma studio
# 在 Prisma Studio 中创建一个 role 为 ADMIN 的用户
```

### 4. 本地开发

```bash
# 安装依赖
npm install

# 运行数据库迁移
npx prisma migrate dev

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
my-website/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (public)/        # 公共页面
│   │   ├── admin/           # 管理后台
│   │   ├── api/             # API 路由
│   │   ├── login/           # 登录页
│   │   └── register/        # 注册页
│   ├── components/          # React 组件
│   ├── lib/                 # 工具函数
│   └── generated/prisma     # Prisma 客户端
├── prisma/
│   └── schema.prisma        # 数据库模型
├── docker-compose.yml       # Docker 配置
└── Dockerfile              # 构建配置
```

## 管理员功能

1. 访问 `/admin` 进入管理后台
2. 文章管理：创建、编辑、删除文章
3. 分类/标签管理
4. 问答审核和回复

## 部署到云服务器

### 1. 准备服务器

确保服务器已安装 Docker 和 Docker Compose：

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose-plugin
```

### 2. 上传项目

```bash
# 在本地打包
tar czvf my-website.tar.gz my-website/

# 上传到服务器
scp my-website.tar.gz user@server:/opt/

# 在服务器上解压
ssh user@server "cd /opt && tar xzvf my-website.tar.gz"
```

### 3. 配置生产环境变量

在服务器上创建 `.env` 文件：

```bash
cd /opt/my-website
cp .env.local .env
# 编辑 .env 文件，设置生产环境值
vim .env
```

### 4. 启动服务

```bash
docker-compose up -d
```

### 5. 配置 Nginx（推荐）

创建 `/etc/nginx/sites-available/my-website`：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/my-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. 配置 SSL（Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 备份

### 数据库备份

```bash
# 手动备份
docker-compose exec db pg_dump -U user mywebsite > backup_$(date +%Y%m%d).sql

# 自动备份脚本（添加到 crontab）
0 2 * * * cd /opt/my-website && docker-compose exec -T db pg_dump -U user mywebsite > backups/backup_$(date +\%Y\%m\%d).sql
```

## 许可证

MIT
