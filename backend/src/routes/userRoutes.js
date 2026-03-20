import { Router } from "express";
import { getCurrentUser } from "../controllers/userController.js";

export const userRoutes = Router();

userRoutes.get("/me", getCurrentUser);
