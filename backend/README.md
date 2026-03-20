# VibeBattle Backend

当前后端是 VibeBattle MVP 的 Node.js + Express 骨架。

## 数据库

当前后端已接入 Prisma，并以 PostgreSQL 作为目标数据库。

## 启动方式

```bash
cd backend
npm install
npm run dev
```

生产方式：

```bash
cd backend
npm start
```

如果本机 `4000` 端口被占用，可以临时改端口：

```bash
cd backend
PORT=4001 npm start
```

## Prisma 命令

生成 Prisma Client：

```bash
cd backend
npm run prisma:generate
```

执行 migration：

```bash
cd backend
npm run prisma:migrate -- --name init
```

部署已存在 migration：

```bash
cd backend
npm run prisma:deploy
```

执行 seed：

```bash
cd backend
npm run prisma:seed
```

## 默认端口

- `4000`

可通过 `.env` 覆盖，参考 `.env.example`。

数据库连接通过 `DATABASE_URL` 配置，参考 `.env.example`。
CORS 来源通过 `CORS_ORIGIN` 配置，支持单个域名或逗号分隔的多个域名。

## 当前接口

- `GET /health`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `POST /api/tasks/:id/join`
- `POST /api/tasks/:id/submissions`
- `GET /api/tasks/:id/submissions`
- `GET /api/users/me`

## 部署建议

推荐组合：

- 前端：Vercel
- 后端：Render 或 Railway
- 数据库：Neon Postgres

### Render / Railway 部署后端

1. 将 `backend/` 作为独立服务目录
2. 安装命令填写：`npm install`
3. 启动命令填写：`npm start`
4. 设置环境变量：
   - `PORT`
   - `NODE_ENV=production`
   - `DATABASE_URL`
   - `CORS_ORIGIN`
5. 首次部署后执行：
   - `npm run prisma:deploy`
   - 如需初始化数据，再执行 `npm run prisma:seed`

### 健康检查

健康检查路径：

- `/health`

部署平台的 health check 可以直接配置为：

- `https://your-backend-domain/health`

## 当前约束

- 不接鉴权
- 不接支付
- 不接 WebSocket
- 当前已完成数据库 schema 和 seed，接口层仍以 mock/service 骨架为主

## 下一步建议

下一轮可先引入数据库层，建议优先补：

1. 在 `services/` 之下接 Prisma 查询
2. 把任务、报名、提交接口逐步切到数据库
3. 增加 DTO/参数校验
4. 加入 repository 或 query layer，避免控制器直接写 Prisma
