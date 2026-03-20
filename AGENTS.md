# VibeBattle AGENTS

## 项目目标

VibeBattle 是一个 Vibe Coding 竞赛平台的 MVP。

当前阶段目标：

- 先用 Mock 数据跑通前端页面和基础交互
- 先验证页面信息架构、核心页面流转和组件拆分方式
- 为后续接入真实后端 API 预留清晰边界

当前优先级：

1. 前端页面可运行
2. 目录结构可扩展
3. Mock 数据与 UI 解耦
4. 后续 API 可替换

## 技术栈

- 前端：Vite + React
- 语言：当前可接受 JSX/TSX 并存，后续优先统一到 TypeScript
- 样式：优先原生 CSS、CSS Modules 或轻量样式方案
- 数据：当前使用本地 Mock 数据

当前阶段不默认引入：

- 重型 UI 框架
- 全局状态管理库
- 真实后端依赖

## MVP 范围

本阶段只覆盖前端 MVP，建议包含：

- 首页 / Landing Page
- 任务列表页
- 任务详情页
- Showcase / 开源广场
- 排行榜
- 基础导航与页面切换
- 基于本地 Mock 数据的展示与简单交互

本阶段明确不做：

- 真实支付流程
- WebSocket 实时对战
- 文件上传体系
- 复杂权限系统
- 完整账号体系
- 生产级后端服务
- 复杂风控、审核、通知中心

除非用户明确要求，否则不要主动引入支付、WebSocket、文件上传、复杂权限系统。

## 开发约束

- 优先保持简单，先把页面与信息结构整理清楚
- 页面优先于复杂逻辑，避免过早设计
- 组件拆分要清晰，但不要为了拆分而拆分
- 先前端后后端，当前不要接入真实 API
- 当前不要引入状态管理库，除非多个页面已经出现明显共享状态压力
- 当前不要引入重型 UI 框架，避免样式系统过早锁死
- 所有数据访问都应通过可替换的数据层封装，避免页面直接绑定真实 API
- Mock 数据应集中管理，避免散落在页面组件内部
- 页面组件负责展示，数据转换和配置尽量下沉到 `features`、`services` 或 `mocks`
- 保持 API 可替换性：后续应能从 `mock service` 平滑切换到 `http service`

## 目录建议

当前仓库可以继续使用现有 Vite 项目作为基础，但推荐逐步朝下面结构收敛：

```text
frontend/
  public/
  src/
    app/
      App.tsx
      routes.tsx
      providers/
    pages/
      LandingPage/
      TasksPage/
      TaskDetailPage/
      ShowcasePage/
      LeaderboardPage/
    features/
      tasks/
      showcase/
      leaderboard/
    components/
      ui/
      layout/
    mocks/
      tasks.ts
      showcases.ts
      leaderboard.ts
    services/
      api/
      adapters/
    styles/
    types/
    utils/
```

如果暂时不拆 `frontend/` 目录，也至少建议在当前仓库内逐步收敛为：

```text
src/
  app/
  pages/
  features/
  components/
  mocks/
  services/
  styles/
  types/
  utils/
```

## 当前仓库判断

- 当前目标目录是 `vibebattle`
- 推荐把这里作为 VibeBattle 的独立项目根目录
- 如果已有可运行的 Vite React 项目，应优先复用它作为前端基础
- 若当前目录仍较空，建议先在这里承接前端结构，再逐步接入页面文件

本轮不做大规模迁移，后续建议按以下顺序整理：

1. 先把 `VibeBattle_App.jsx` 拆成页面、组件、Mock 数据
2. 再建立正式的前端入口和 `src/` 结构
3. 最后再决定是否需要额外拆出独立 `frontend/` 目录

## 接入原则

- 当前只保证前端可运行
- 所有“后端”能力先用 Mock 数据或本地 adapter 替代
- 后续若接 API，应优先增加 `services/api` 和 `services/adapters`
- 页面层不直接写死请求逻辑

## 本轮特别说明

本轮工作以项目整理和规则落地为主，不进行大规模业务重构。

如果 `VibeBattle_App.jsx` 还未正式接入当前项目，下一轮优先做入口接入与结构拆分。
