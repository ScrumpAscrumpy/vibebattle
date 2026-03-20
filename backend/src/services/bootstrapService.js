import { prisma } from "../lib/prisma.js";

const demoTasks = [
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
];

let bootstrapPromise = null;

export async function ensureMvpSeedData() {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      await prisma.user.createMany({
        data: [
          {
            name: "Demo Buyer",
            email: "buyer@vibebattle.local",
            role: "BUYER",
          },
          {
            name: "Demo Coder",
            email: "coder@vibebattle.local",
            role: "CODER",
          },
        ],
      });
    }

    const buyer = await prisma.user.findFirst({ where: { role: "BUYER" }, orderBy: { createdAt: "asc" } });
    const coder = await prisma.user.findFirst({ where: { role: "CODER" }, orderBy: { createdAt: "asc" } });

    const taskCount = await prisma.task.count();
    if (taskCount === 0 && buyer) {
      for (const task of demoTasks) {
        await prisma.task.create({
          data: {
            ...task,
            buyerId: buyer.id,
          },
        });
      }
    }

    const tasks = await prisma.task.findMany({ orderBy: { createdAt: "asc" }, take: 3 });
    const joinCount = await prisma.taskJoin.count();
    if (joinCount === 0 && coder && tasks.length > 0) {
      await prisma.taskJoin.createMany({
        data: tasks.slice(0, 2).map((task) => ({
          taskId: task.id,
          userId: coder.id,
        })),
        skipDuplicates: true,
      });
    }

    const submissionCount = await prisma.submission.count();
    if (submissionCount === 0 && coder && tasks[0]) {
      await prisma.submission.create({
        data: {
          taskId: tasks[0].id,
          userId: coder.id,
          repoUrl: "https://github.com/demo/whiteboard",
          deployUrl: "https://demo.example.com/whiteboard",
          notes: "Auto-bootstrapped demo submission",
        },
      });
    }
  })();

  try {
    await bootstrapPromise;
  } finally {
    bootstrapPromise = null;
  }
}
