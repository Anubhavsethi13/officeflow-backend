import { Router } from "express";
import * as controller from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requirePermission, requireRole } from "../middlewares/role.middleware";

export const profileRoutes = Router();

profileRoutes.use(authenticate);
profileRoutes.post("/attendance/checkin", requirePermission("Employee Portal", "canCreate"), controller.checkIn);
profileRoutes.post("/attendance/checkout", requirePermission("Employee Portal", "canCreate"), controller.checkOut);
profileRoutes.post("/leaves/request", requirePermission("Employee Portal", "canCreate"), controller.requestLeave);
profileRoutes.patch("/leaves/approve", requireRole("SUPER_ADMIN", "MD", "DEPARTMENT_HEAD"), controller.approveLeave);
profileRoutes.get("/dashboard/stats", requirePermission("Dashboard", "canView"), controller.dashboardStats);
