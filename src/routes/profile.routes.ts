import { Router } from "express";
import * as controller from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middleware";

export const profileRoutes = Router();

profileRoutes.use(authenticate);
profileRoutes.get("/dashboard/stats", requirePermission("Dashboard", "canView"), controller.dashboardStats);
