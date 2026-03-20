import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/httpError.js";
import {
  assertEnum,
  assertOptionalString,
  assertPositiveInt,
  assertRequiredString,
} from "../utils/validation.js";
import { getFixedBuyerUser, getFixedCoderUser } from "./userService.js";
import { ensureMvpSeedData } from "./bootstrapService.js";

const TASK_STATUS_VALUES = ["OPEN", "COUNTDOWN", "IN_PROGRESS", "COMPLETED"];
const TASK_DIFFICULTY_VALUES = ["EASY", "MEDIUM", "HARD", "EXPERT"];
const TASK_TYPE_VALUES = ["BOUNTY", "TOURNAMENT", "CHALLENGE"];
const TASK_ORDER_FIELDS = {
  createdAt: { createdAt: "desc" },
  prize: { prize: "desc" },
};

function mapTask(task) {
  return {
    id: task.id,
    title: task.title,
    brief: task.brief,
    summary: task.summary,
    description: task.description,
    prize: task.prize,
    openSourceBonus: task.openSourceBonus,
    difficulty: task.difficulty,
    type: task.type,
    techTags: task.techTags,
    deliverables: task.deliverables,
    rules: task.rules,
    timeline: task.timeline,
    durationHours: task.durationHours,
    participantLimit: task.participantLimit,
    startAt: task.startAt,
    endAt: task.endAt,
    status: task.status,
    createdAt: task.createdAt,
    buyer: task.buyer
      ? {
          id: task.buyer.id,
          name: task.buyer.name,
          email: task.buyer.email,
          role: task.buyer.role,
        }
      : null,
    counts: {
      joins: task._count?.joins ?? 0,
      submissions: task._count?.submissions ?? 0,
    },
  };
}

function mapSubmission(submission) {
  return {
    id: submission.id,
    taskId: submission.taskId,
    userId: submission.userId,
    repoUrl: submission.repoUrl,
    deployUrl: submission.deployUrl,
    notes: submission.notes,
    createdAt: submission.createdAt,
    user: submission.user
      ? {
          id: submission.user.id,
          name: submission.user.name,
          email: submission.user.email,
          role: submission.user.role,
        }
      : null,
  };
}

function parseStringArray(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];
}

export async function getTaskList(query = {}) {
  await ensureMvpSeedData();
  const where = {};

  if (query.status) {
    where.status = assertEnum(query.status, "status", TASK_STATUS_VALUES);
  }

  if (query.type) {
    where.type = assertEnum(query.type, "type", TASK_TYPE_VALUES);
  }

  const orderBy = TASK_ORDER_FIELDS[query.orderBy] ?? TASK_ORDER_FIELDS.createdAt;

  const tasks = await prisma.task.findMany({
    where,
    orderBy,
    include: {
      buyer: true,
      _count: {
        select: {
          joins: true,
          submissions: true,
        },
      },
    },
  });

  return tasks.map(mapTask);
}

export async function findTaskById(taskId) {
  await ensureMvpSeedData();
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      buyer: true,
      _count: {
        select: {
          joins: true,
          submissions: true,
        },
      },
    },
  });

  return task ? mapTask(task) : null;
}

export async function createTaskRecord(payload, currentUser) {
  const buyer = currentUser ?? (await getFixedBuyerUser());

  const title = assertRequiredString(payload.title, "title");
  const brief = assertRequiredString(payload.brief, "brief");
  const summary = assertRequiredString(payload.summary, "summary");
  const description = assertRequiredString(payload.description, "description");
  const prize = assertPositiveInt(payload.prize, "prize");
  const openSourceBonus =
    payload.openSourceBonus == null || payload.openSourceBonus === ""
      ? 0
      : Number.isFinite(Number(payload.openSourceBonus)) && Number(payload.openSourceBonus) >= 0
        ? Number(payload.openSourceBonus)
        : (() => {
            throw new HttpError(400, "openSourceBonus must be a non-negative number", {
              field: "openSourceBonus",
              code: "VALIDATION_ERROR",
            });
          })();
  const durationHours = assertPositiveInt(payload.durationHours, "durationHours");
  const difficulty = assertEnum(payload.difficulty, "difficulty", TASK_DIFFICULTY_VALUES);
  const type = assertEnum(payload.type, "type", TASK_TYPE_VALUES);
  const status = assertEnum(payload.status, "status", TASK_STATUS_VALUES);
  const participantLimit =
    payload.participantLimit == null || payload.participantLimit === ""
      ? null
      : assertPositiveInt(payload.participantLimit, "participantLimit");
  const startAt = payload.startAt ? new Date(payload.startAt) : null;
  const endAt = payload.endAt ? new Date(payload.endAt) : null;

  const task = await prisma.task.create({
    data: {
      title,
      brief,
      summary,
      description,
      prize,
      openSourceBonus,
      difficulty,
      type,
      techTags: parseStringArray(payload.techTags),
      deliverables: parseStringArray(payload.deliverables),
      rules: parseStringArray(payload.rules),
      timeline: parseStringArray(payload.timeline),
      durationHours,
      participantLimit,
      startAt,
      endAt,
      status,
      buyerId: buyer.id,
    },
    include: {
      buyer: true,
      _count: {
        select: {
          joins: true,
          submissions: true,
        },
      },
    },
  });

  return mapTask(task);
}

export async function getJoinStatusForTask(taskId, currentUser) {
  await ensureMvpSeedData();
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new HttpError(404, "Task not found", { code: "TASK_NOT_FOUND" });
  }

  const coder = currentUser ?? (await getFixedCoderUser());
  const join = await prisma.taskJoin.findUnique({
    where: {
      taskId_userId: {
        taskId,
        userId: coder.id,
      },
    },
  });

  return {
    isJoined: Boolean(join),
    joinedAt: join?.joinedAt ?? null,
    taskId,
    userId: coder.id,
  };
}

export async function joinTaskById(taskId, currentUser) {
  await ensureMvpSeedData();
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new HttpError(404, "Task not found", { code: "TASK_NOT_FOUND" });
  }

  const coder = currentUser ?? (await getFixedCoderUser());
  const existingJoin = await prisma.taskJoin.findUnique({
    where: {
      taskId_userId: {
        taskId,
        userId: coder.id,
      },
    },
  });

  if (existingJoin) {
    throw new HttpError(409, "User already joined this task", {
      code: "TASK_ALREADY_JOINED",
    });
  }

  const join = await prisma.taskJoin.create({
    data: {
      taskId,
      userId: coder.id,
    },
  });

  return {
    id: join.id,
    taskId: join.taskId,
    userId: join.userId,
    joinedAt: join.joinedAt,
  };
}

export async function saveTaskSubmission(taskId, payload, currentUser) {
  await ensureMvpSeedData();
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new HttpError(404, "Task not found", { code: "TASK_NOT_FOUND" });
  }

  const coder = currentUser ?? (await getFixedCoderUser());
  const repoUrl = assertOptionalString(payload.repoUrl);
  const deployUrl = assertOptionalString(payload.deployUrl);
  const notes = assertOptionalString(payload.notes);

  if (!repoUrl && !deployUrl) {
    throw new HttpError(400, "repoUrl or deployUrl is required", {
      code: "VALIDATION_ERROR",
      fields: ["repoUrl", "deployUrl"],
    });
  }

  const submission = await prisma.submission.create({
    data: {
      taskId,
      userId: coder.id,
      repoUrl: repoUrl ?? "",
      deployUrl,
      notes,
    },
    include: {
      user: true,
    },
  });

  return mapSubmission(submission);
}

export async function getSubmissionList(taskId) {
  await ensureMvpSeedData();
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new HttpError(404, "Task not found", { code: "TASK_NOT_FOUND" });
  }

  const submissions = await prisma.submission.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });

  return submissions.map(mapSubmission);
}
