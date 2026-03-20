import { Router } from "express";
import { healthRoutes } from "./healthRoutes.js";
import { taskRoutes } from "./taskRoutes.js";
import { userRoutes } from "./userRoutes.js";

export const router = Router();

router.use(healthRoutes);
router.use("/api/tasks", taskRoutes);
router.use("/api/users", userRoutes);
