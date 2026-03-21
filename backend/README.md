# VibeBattle Backend

当前后端使用：

- Node.js + Express
- Prisma
- PostgreSQL

本地开发数据库默认使用根目录的 `docker-compose.yml` 启动 PostgreSQL。

## 本地启动

### 1. 复制环境变量

```bash
cd /Users/scrumpy/Documents/vibebattle/backend
cp .env.example .env
```

### 2. 启动本地数据库

```bash
cd /Users/scrumpy/Documents/vibebattle/backend
npm run db:up
```

### 3. 初始化数据库

```bash
cd /Users/scrumpy/Documents/vibebattle/backend
npm run setup:local
```

这个命令会依次执行：

1. `prisma generate`
2. `prisma migrate dev`
3. `prisma seed`

### 4. 启动后端

```bash
cd /Users/scrumpy/Documents/vibebattle/backend
npm run dev
```

生产启动：

```bash
npm start
```

## 常用命令

### 启动本地数据库

```bash
npm run db:up
```

### 关闭本地数据库

```bash
npm run db:down
```

### 查看数据库日志

```bash
npm run db:logs
```

### 生成 Prisma Client

```bash
npm run prisma:generate
```

### 执行 migration

```bash
npm run prisma:migrate -- --name local-init
```

### 执行 seed

```bash
npm run prisma:seed
```

## 环境变量

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `CORS_ORIGIN`

本地默认 `DATABASE_URL` 见：

- [/Users/scrumpy/Documents/vibebattle/backend/.env.example](/Users/scrumpy/Documents/vibebattle/backend/.env.example)

## 健康检查

后端健康检查：

- `GET /health`

本地验证：

```bash
curl http://127.0.0.1:4000/health
```

## 当前接口

- `GET /health`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `GET /api/tasks/:id/join-status`
- `POST /api/tasks`
- `POST /api/tasks/:id/join`
- `POST /api/tasks/:id/submissions`
- `GET /api/tasks/:id/submissions`
- `GET /api/users/me`

## 当前约束

- 不接真实登录
- 不接支付
- 不接 WebSocket
- 本地开发不再依赖后端自动 mock seed 兜底
- 本地数据库数据请通过 migration + seed 明确初始化
