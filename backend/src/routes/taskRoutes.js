import { Router } from "express";
import {
  createTask,
  getTaskById,
  getTaskJoinStatus,
  getTaskSubmissions,
  getTasks,
  joinTask,
  submitTaskWork,
} from "../controllers/taskController.js";
import { requireRole } from "../middlewares/requireRole.js";

export const taskRoutes = Router();

taskRoutes.get("/", getTasks);
taskRoutes.get("/:id", getTaskById);
taskRoutes.get("/:id/join-status", requireRole("CODER"), getTaskJoinStatus);
taskRoutes.post("/", requireRole("BUYER"), createTask);
taskRoutes.post("/:id/join", requireRole("CODER"), joinTask);
taskRoutes.post("/:id/submissions", requireRole("CODER"), submitTaskWork);
taskRoutes.get("/:id/submissions", getTaskSubmissions);
