# VibeBattle

VibeBattle 是一个面向 Vibe Coding 场景的竞赛平台 MVP。当前仓库已经包含：

- 前端：Vite + React
- 后端：Node.js + Express
- 数据库：PostgreSQL + Prisma

本轮目标是让项目具备部署到线上预览环境的条件。

## 项目结构

```text
vibebattle/
  src/         # 前端
  backend/     # 后端
  vercel.json  # 前端 SPA 路由重写
```

## 本地启动

### 1. 启动前端

```bash
cd /Users/scrumpy/Documents/vibebattle
cp .env.example .env
npm install
npm run dev
```

前端环境变量：

- `VITE_API_BASE_URL`
  默认值：`http://127.0.0.1:4000`

### 2. 启动后端

```bash
cd /Users/scrumpy/Documents/vibebattle/backend
cp .env.example .env
npm install
npm start
```

如果本机 `4000` 端口被占用：

```bash
cd /Users/scrumpy/Documents/vibebattle/backend
PORT=4001 npm start
```

后端环境变量：

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `CORS_ORIGIN`

## 部署建议

推荐组合：

- 前端：Vercel
- 后端：Render 或 Railway
- 数据库：Neon Postgres

## 前端部署步骤

### Vercel

1. 将仓库导入 Vercel
2. Root Directory 选择仓库根目录 `vibebattle`
3. Build Command 使用：

```bash
npm run build
```

4. Output Directory 使用：

```bash
dist
```

5. 添加前端环境变量：

```bash
VITE_API_BASE_URL=https://your-backend-domain.onrender.com
```

6. 重新部署

### React Router 处理

前端使用 React Router，线上需要把任意路径都重写到 `index.html`。

这个仓库已经提供：

- [vercel.json](/Users/scrumpy/Documents/vibebattle/vercel.json)

它会把 Vercel 上的所有前端路由重写到单页应用入口，确保：

- `/`
- `/tasks`
- `/tasks/:id`
- `/arena/:id`
- `/dashboard`

都能直接刷新访问。

## 后端部署步骤

### Render

1. 在 Render 新建 Web Service
2. Root Directory 选择：

```bash
backend
```

3. Build Command：

```bash
npm install
```

4. Start Command：

```bash
npm start
```

5. 添加环境变量：

```bash
PORT=4000
NODE_ENV=production
DATABASE_URL=你的 Neon 连接串
CORS_ORIGIN=https://your-frontend.vercel.app
```

如果需要允许多个域名，可以写成逗号分隔：

```bash
CORS_ORIGIN=https://your-frontend.vercel.app,https://preview-branch.vercel.app
```

6. 部署成功后，执行：

```bash
npm run prisma:deploy
```

如需初始化演示数据，再执行：

```bash
npm run prisma:seed
```

### Railway

Railway 流程基本相同：

1. 选择 `backend` 目录作为服务
2. 安装命令：`npm install`
3. 启动命令：`npm start`
4. 配置 `DATABASE_URL`、`CORS_ORIGIN`、`NODE_ENV`

## 数据库配置步骤

### Neon Postgres

1. 创建 Neon 项目
2. 新建数据库
3. 拿到连接串
4. 将连接串写入后端环境变量：

```bash
DATABASE_URL=postgresql://...
```

5. 在后端服务环境中执行 migration：

```bash
npm run prisma:deploy
```

6. 如需演示数据，执行：

```bash
npm run prisma:seed
```

## 生产环境需要的环境变量

### 前端

- `VITE_API_BASE_URL`

### 后端

- `PORT`
- `NODE_ENV=production`
- `DATABASE_URL`
- `CORS_ORIGIN`

## 健康检查

后端已提供健康检查接口：

- `GET /health`

线上可用于部署平台健康检查，例如：

```bash
https://your-backend-domain.onrender.com/health
```

## 最小上线检查清单

上线前至少确认以下内容：

1. 前端本地 `npm run build` 通过
2. 后端本地 `npm start` 能启动
3. Neon 数据库已创建
4. `DATABASE_URL` 已正确配置到后端平台
5. 已执行 `npm run prisma:deploy`
6. 如需演示数据，已执行 `npm run prisma:seed`
7. 前端 `VITE_API_BASE_URL` 已指向线上后端域名
8. 后端 `CORS_ORIGIN` 已包含前端线上域名
9. 线上访问 `/health` 返回正常
10. 线上前端刷新 `/tasks`、`/dashboard` 不会 404

## 当前不包含的内容

本轮仍然不包含：

- 支付
- 文件上传
- WebSocket
- 正式监控系统
