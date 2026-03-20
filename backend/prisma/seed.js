import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.submission.deleteMany();
  await prisma.taskJoin.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const buyer = await prisma.user.create({
    data: {
      name: "Demo Buyer",
      email: "buyer@vibebattle.local",
      role: "BUYER",
    },
  });

  const coder = await prisma.user.create({
    data: {
      name: "Demo Coder",
      email: "coder@vibebattle.local",
      role: "CODER",
    },
  });

  const taskInputs = [
    {
      title: "实时协作白板工具",
      brief: "多人在线白板 MVP，强调协作体验和交付速度。",
      summary: "支持多人实时协作的在线白板应用",
      description: "实现任务市场演示用的白板产品页和交付流程。",
      prize: 500,
      openSourceBonus: 100,
      difficulty: "HARD",
      type: "BOUNTY",
      techTags: ["React", "Canvas", "Collaboration"],
      deliverables: ["首页", "任务详情页", "白板主界面"],
      rules: ["作品可本地运行", "需附交付说明", "禁止接入真实支付"],
      timeline: ["报名开放中", "开发时长 12 小时", "结束后评审"],
      durationHours: 12,
      participantLimit: 20,
      startAt: new Date("2026-03-21T10:00:00.000Z"),
      endAt: new Date("2026-03-21T22:00:00.000Z"),
      status: "OPEN",
    },
    {
      title: "AI 代码审查助手",
      brief: "构建代码审查产品原型，强调结果页信息结构。",
      summary: "自动分析代码质量并给出改进建议",
      description: "实现 MVP 详情页、审查结果页和提交说明。",
      prize: 2000,
      openSourceBonus: 300,
      difficulty: "EXPERT",
      type: "TOURNAMENT",
      techTags: ["React", "TypeScript", "AI Review"],
      deliverables: ["介绍页", "结果页", "评审说明"],
      rules: ["不接真实 LLM", "强调评审流程", "支持后续 API 对接"],
      timeline: ["倒计时阶段", "开发时长 24 小时", "赛后评审"],
      durationHours: 24,
      participantLimit: 50,
      startAt: new Date("2026-03-23T09:00:00.000Z"),
      endAt: new Date("2026-03-24T09:00:00.000Z"),
      status: "COUNTDOWN",
    },
    {
      title: "个人财务仪表盘",
      brief: "桌面端财务看板，突出图表与预算提醒。",
      summary: "多账户聚合与预算看板",
      description: "实现桌面端财务仪表盘展示页面。",
      prize: 300,
      openSourceBonus: 50,
      difficulty: "MEDIUM",
      type: "BOUNTY",
      techTags: ["React", "Charts", "Dashboard"],
      deliverables: ["仪表盘首页", "预算卡片", "分类视图"],
      rules: ["不接真实银行 API", "图表可用假数据", "布局需桌面端优先"],
      timeline: ["报名开放中", "开发时长 8 小时", "提交后演示"],
      durationHours: 8,
      participantLimit: 30,
      startAt: new Date("2026-03-20T08:00:00.000Z"),
      endAt: new Date("2026-03-20T16:00:00.000Z"),
      status: "OPEN",
    },
    {
      title: "Markdown 知识库搜索引擎",
      brief: "本地文档搜索界面原型，突出搜索体验。",
      summary: "本地文档索引和搜索界面",
      description: "实现前端检索体验和任务竞赛页。",
      prize: 800,
      openSourceBonus: 150,
      difficulty: "HARD",
      type: "CHALLENGE",
      techTags: ["Electron", "Search", "Markdown"],
      deliverables: ["搜索页", "结果页", "Arena 页面"],
      rules: ["不接真实向量服务", "说明清晰", "交互闭环完整"],
      timeline: ["比赛进行中", "开发时长 18 小时", "结束后评审"],
      durationHours: 18,
      participantLimit: 15,
      startAt: new Date("2026-03-19T09:00:00.000Z"),
      endAt: new Date("2026-03-20T03:00:00.000Z"),
      status: "IN_PROGRESS",
    },
    {
      title: "社交媒体内容日历",
      brief: "内容排期工具原型，突出管理视图和状态感。",
      summary: "支持排期和预览的内容管理工具",
      description: "实现内容排期页和任务说明页。",
      prize: 400,
      openSourceBonus: 80,
      difficulty: "MEDIUM",
      type: "BOUNTY",
      techTags: ["Calendar", "Content Ops", "React"],
      deliverables: ["内容列表", "日历视图", "详情页"],
      rules: ["不接真实社媒平台", "只做 MVP", "保持信息结构清晰"],
      timeline: ["比赛已完成", "开发时长 10 小时", "结果归档"],
      durationHours: 10,
      participantLimit: 25,
      startAt: new Date("2026-03-15T09:00:00.000Z"),
      endAt: new Date("2026-03-15T19:00:00.000Z"),
      status: "COMPLETED",
    },
    {
      title: "实时投票系统",
      brief: "高并发投票产品原型，强调结果可视化。",
      summary: "支持高并发投票和结果展示",
      description: "实现投票页面、结果页和控制台概览。",
      prize: 650,
      openSourceBonus: 120,
      difficulty: "HARD",
      type: "CHALLENGE",
      techTags: ["Polling", "Visualization", "Realtime-ready"],
      deliverables: ["投票页", "结果页", "概览页"],
      rules: ["不接 WebSocket", "结果可用轮询假数据", "强调稳定展示"],
      timeline: ["报名开放中", "开发时长 16 小时", "赛后评审"],
      durationHours: 16,
      participantLimit: 40,
      startAt: new Date("2026-03-22T08:00:00.000Z"),
      endAt: new Date("2026-03-23T00:00:00.000Z"),
      status: "OPEN",
    },
  ];

  const tasks = [];
  for (const input of taskInputs) {
    const task = await prisma.task.create({
      data: {
        ...input,
        buyerId: buyer.id,
      },
    });
    tasks.push(task);
  }

  await prisma.taskJoin.createMany({
    data: [
      { taskId: tasks[0].id, userId: coder.id },
      { taskId: tasks[1].id, userId: coder.id },
      { taskId: tasks[3].id, userId: coder.id },
    ],
  });

  await prisma.submission.createMany({
    data: [
      {
        taskId: tasks[0].id,
        userId: coder.id,
        repoUrl: "https://github.com/demo/whiteboard",
        deployUrl: "https://demo.example.com/whiteboard",
        notes: "MVP version with collaborative UX mock.",
      },
      {
        taskId: tasks[3].id,
        userId: coder.id,
        repoUrl: "https://github.com/demo/markdown-search",
        deployUrl: "https://demo.example.com/markdown-search",
        notes: "Includes search page and arena prototype.",
      },
    ],
  });

  console.log(`Seed completed: ${2} users, ${tasks.length} tasks`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
