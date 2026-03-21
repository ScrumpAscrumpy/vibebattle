# VibeBattle

VibeBattle 是一个 Vibe Coding 竞赛平台 MVP。

当前仓库包含：

- 前端：Vite + React
- 后端：Node.js + Express
- 数据库：PostgreSQL + Prisma

本地开发现在默认使用真实 PostgreSQL 数据库，不再依赖后端自动 mock 数据兜底。

## 我选择的本地数据库方案

本地开发数据库方案：`Docker Desktop + docker compose + PostgreSQL 16`

选择原因：

- 保持你现在的 `PostgreSQL + Prisma` 路线，不改成 SQLite
- 不影响线上 Render + Neon 的 `DATABASE_URL` 使用方式
- 本地和线上数据库类型一致，联调更稳定
- 对非专业开发者更简单，只要先装好 Docker Desktop

## 项目结构

```text
vibebattle/
  src/              # 前端
  backend/          # 后端
  docker-compose.yml
  vercel.json
```

## 环境变量

### 前端

复制根目录环境变量：

```bash
cp .env.example .env
```

默认内容：

```bash
VITE_API_BASE_URL=http://127.0.0.1:4000
```

### 后端

复制后端环境变量：

```bash
cd backend
cp .env.example .env
```

本地默认数据库连接：

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vibebattle?schema=public"
```

线上环境继续使用部署平台自己的 `DATABASE_URL`，不要把真实线上密钥写进仓库。

## 本地启动说明

### 先决条件

你需要先安装：

1. Node.js
2. npm
3. Docker Desktop

确认 Docker 已启动后，再继续下面步骤。

### 第一步：启动本地 PostgreSQL

在项目根目录执行：

```bash
cd /Users/scrumpy/Documents/vibebattle
npm run db:up
```

如果你想看数据库日志：

```bash
npm run db:logs
```

### 第二步：初始化 Prisma 本地数据库

执行：

```bash
cd /Users/scrumpy/Documents/vibebattle
npm run backend:setup
```

这个命令会自动完成：

1. 生成 Prisma Client
2. 执行本地 migration
3. 执行 seed

seed 会写入最小可用数据：

- 1 个 buyer 用户
- 1 个 coder 用户
- 多个任务
- 报名关系
- submission 数据

### 第三步：启动后端

开一个新终端窗口，执行：

```bash
cd /Users/scrumpy/Documents/vibebattle
npm run backend:dev
```

后端默认地址：

```bash
http://127.0.0.1:4000
```

健康检查：

```bash
http://127.0.0.1:4000/health
```

### 第四步：启动前端

再开一个新终端窗口，执行：

```bash
cd /Users/scrumpy/Documents/vibebattle
npm run dev
```

前端默认会读取：

```bash
VITE_API_BASE_URL=http://127.0.0.1:4000
```

## 如何确认本地数据库已经正常工作

你可以按下面顺序检查：

### 1. 数据库容器是否已启动

```bash
cd /Users/scrumpy/Documents/vibebattle
docker compose ps
```

你应该能看到 `postgres` 服务处于 `running` 或 `healthy`。

### 2. 后端健康检查是否正常

浏览器打开或命令行执行：

```bash
curl http://127.0.0.1:4000/health
```

### 3. 任务接口是否返回真实数据

```bash
curl http://127.0.0.1:4000/api/tasks
```

如果返回有任务列表，说明本地数据库、Prisma、后端接口已经打通。

## 如何确认前端已经不再使用 mock data

确认方式：

1. 先执行本地数据库初始化
2. 打开前端首页、Tasks、Task Detail、Dashboard、Arena
3. 在 Dashboard 新建一个任务
4. 刷新页面后这个任务仍然存在
5. 再请求：

```bash
curl http://127.0.0.1:4000/api/tasks
```

如果能在接口返回中看到你刚创建的任务，就说明前端现在走的是：

- 前端 -> 本地后端 API
- 后端 -> 本地 PostgreSQL

而不是本地 mock 数据。

## 现在哪些页面已经主要使用本地数据库

以下页面本地开发时都优先走真实 API + 本地 PostgreSQL：

- Home
- Tasks
- Task Detail
- Dashboard
- Arena

说明：

- Home 的推荐任务、首页展示列表已经来自数据库/API
- Home 中的 showcase / leaderboard 现在也是根据任务 API 数据派生，不再读取本地静态 mock 文件

## 线上环境说明

线上结构不变：

- 前端：Vercel
- 后端：Render / Railway
- 数据库：Neon

线上仍然通过部署平台配置自己的 `DATABASE_URL`，本地 docker 数据库不会影响线上。

## 常用命令

### 启动本地数据库

```bash
npm run db:up
```

### 关闭本地数据库

```bash
npm run db:down
```

### 初始化本地数据库

```bash
npm run backend:setup
```

### 启动后端

```bash
npm run backend:dev
```

### 启动前端

```bash
npm run dev
```

## 启动失败时最常见排查点

### 1. Docker 没启动

表现：

- `docker compose up` 失败
- PostgreSQL 容器起不来

处理：

- 先打开 Docker Desktop

### 2. 5432 端口被占用

表现：

- PostgreSQL 容器启动失败

处理：

- 关闭本机已有 PostgreSQL
- 或改 `docker-compose.yml` 端口映射

### 3. 后端 `.env` 没复制

表现：

- Prisma 报 `DATABASE_URL` 缺失

处理：

```bash
cd /Users/scrumpy/Documents/vibebattle/backend
cp .env.example .env
```

### 4. migration 没跑

表现：

- 后端能启动，但接口报数据库表不存在

处理：

```bash
cd /Users/scrumpy/Documents/vibebattle
npm run backend:setup
```

### 5. 前端连到了错误的 API 地址

表现：

- 页面一直加载失败
- 浏览器网络请求打到线上或错误端口

处理：

- 检查根目录 `.env`
- 确认 `VITE_API_BASE_URL=http://127.0.0.1:4000`
