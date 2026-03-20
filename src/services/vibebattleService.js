import { leaderboard } from "../data/leaderboard";
import { showcases } from "../data/showcases";
import { apiRequest, getStoredCurrentUser } from "../lib/apiClient";

const LEGACY_STORAGE_KEYS = [
  "vibebattle.createdTasks",
  "vibebattle.enrollments",
  "vibebattle.submissions",
];

function clearLegacyStorage() {
  if (typeof window === "undefined") {
    return;
  }

  LEGACY_STORAGE_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

function normalizeDifficulty(value) {
  const difficultyMap = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
    EXPERT: 4,
  };

  return difficultyMap[value] ?? 2;
}

function normalizeTask(task) {
  return {
    id: task.id,
    title: task.title,
    brief: task.brief,
    summary: task.summary,
    description: task.description,
    bountyAmount: task.prize,
    openSourceBonus: task.openSourceBonus ?? 0,
    difficulty: normalizeDifficulty(task.difficulty),
    timeLimit: task.durationHours * 60,
    durationHours: task.durationHours,
    status: task.status,
    type: task.type,
    createdAt: task.createdAt,
    startAt: task.startAt,
    endAt: task.endAt,
    creator: {
      displayName: task.buyer?.name || "VibeBattle Buyer",
    },
    techTags: task.techTags ?? [],
    deliverables: task.deliverables ?? [],
    briefList: task.brief ? [task.brief] : [],
    rules: task.rules ?? [],
    timeline: (task.timeline ?? []).map((item, index) => ({
      label: `安排 ${index + 1}`,
      value: item,
    })),
    currentParticipants: task.counts?.joins ?? 0,
    maxParticipants: task.participantLimit ?? 50,
    submissionCount: task.counts?.submissions ?? 0,
  };
}

function normalizeSubmission(submission) {
  return {
    id: submission.id,
    repoUrl: submission.repoUrl || "",
    deployUrl: submission.deployUrl || "",
    notes: submission.notes || "",
    submittedAt: submission.createdAt,
    user: submission.user || null,
  };
}

export async function getTasks(filters = {}) {
  clearLegacyStorage();

  const searchParams = new URLSearchParams();
  if (filters.status && filters.status !== "ALL") {
    searchParams.set("status", filters.status);
  }
  if (filters.type && filters.type !== "ALL") {
    searchParams.set("type", filters.type);
  }
  if (filters.orderBy) {
    searchParams.set("orderBy", filters.orderBy);
  }

  const query = searchParams.toString();
  const response = await apiRequest(`/api/tasks${query ? `?${query}` : ""}`);
  return response.data.map(normalizeTask);
}

export async function getFeaturedTasks() {
  const tasks = await getTasks({ orderBy: "createdAt" });
  return tasks.slice(0, 3);
}

export async function getTaskById(taskId) {
  clearLegacyStorage();
  const response = await apiRequest(`/api/tasks/${taskId}`);
  return normalizeTask(response.data);
}

export async function getDashboardSummary() {
  const tasks = await getTasks({ orderBy: "createdAt" });
  return {
    activeTasks: tasks.filter((task) => task.status === "OPEN" || task.status === "COUNTDOWN").length,
    liveTasks: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    completedTasks: tasks.filter((task) => task.status === "COMPLETED").length,
    totalParticipants: tasks.reduce((sum, task) => sum + task.currentParticipants, 0),
  };
}

export async function getShowcases() {
  return showcases;
}

export async function getLeaderboard() {
  return leaderboard;
}

export async function createTask(input) {
  clearLegacyStorage();

  const difficultyMap = {
    1: "EASY",
    2: "MEDIUM",
    3: "HARD",
    4: "EXPERT",
  };

  const response = await apiRequest("/api/tasks", {
    method: "POST",
    body: JSON.stringify({
      title: input.title.trim(),
      brief: input.brief.trim(),
      summary: input.summary.trim(),
      description: input.description.trim(),
      prize: Number(input.bountyAmount),
      openSourceBonus: input.openSourceBonus ? Number(input.openSourceBonus) : 0,
      difficulty: difficultyMap[input.difficulty] || "MEDIUM",
      durationHours: Math.max(1, Math.ceil(Number(input.timeLimit) / 60)),
      status: input.status,
      type: input.type,
      techTags: input.techTags.split(",").map((item) => item.trim()).filter(Boolean),
      deliverables: input.deliverables.split("\n").map((item) => item.trim()).filter(Boolean),
      rules: input.rules.split("\n").map((item) => item.trim()).filter(Boolean),
      timeline: input.timeline.split("\n").map((item) => item.trim()).filter(Boolean),
    }),
  });

  return normalizeTask(response.data);
}

export async function enrollInTask(taskId) {
  clearLegacyStorage();
  const response = await apiRequest(`/api/tasks/${taskId}/join`, {
    method: "POST",
  });

  return {
    enrolled: true,
    enrolledAt: response.data.joinedAt,
    joinId: response.data.id,
  };
}

export async function getEnrollmentStatus(taskId) {
  const response = await apiRequest(`/api/tasks/${taskId}/join-status`);
  return {
    enrolled: response.data.isJoined,
    enrolledAt: response.data.joinedAt,
    taskId: response.data.taskId,
    userId: response.data.userId,
  };
}

export function getCurrentRole() {
  return getStoredCurrentUser()?.role || null;
}

export async function saveSubmission(taskId, payload) {
  clearLegacyStorage();
  const response = await apiRequest(`/api/tasks/${taskId}/submissions`, {
    method: "POST",
    body: JSON.stringify({
      repoUrl: payload.repoUrl.trim(),
      deployUrl: payload.deployUrl.trim(),
      notes: payload.notes.trim(),
    }),
  });

  return normalizeSubmission(response.data);
}

export async function getLatestSubmission(taskId) {
  clearLegacyStorage();
  const response = await apiRequest(`/api/tasks/${taskId}/submissions`);
  const [latest] = response.data;
  return latest ? normalizeSubmission(latest) : null;
}
