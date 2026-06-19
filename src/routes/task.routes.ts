import { Router } from "express";
import * as controller from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middleware";

export const taskRoutes = Router();

taskRoutes.use(authenticate);
taskRoutes.get("/", requirePermission("Task Management", "canView"), controller.list);
taskRoutes.post("/", requirePermission("Task Management", "canCreate"), controller.create);
taskRoutes.patch("/:id", requirePermission("Task Management", "canUpdate"), controller.update);
taskRoutes.post("/:id/assign", requirePermission("Task Management", "canUpdate"), controller.assign);
taskRoutes.get("/:id/history", requirePermission("Task Management", "canView"), controller.history);
