import { Router } from "express";
import * as controller from "../controllers/access.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middleware";

export const accessRoutes = Router();

accessRoutes.use(authenticate);
accessRoutes.get("/modules", requirePermission("Access Control", "canView"), controller.modules);
accessRoutes.post("/permissions", requirePermission("Access Control", "canCreate"), controller.createPermission);
accessRoutes.patch("/permissions/:id", requirePermission("Access Control", "canUpdate"), controller.updatePermission);
