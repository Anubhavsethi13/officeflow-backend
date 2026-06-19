import { Router } from "express";
import * as controller from "../controllers/employee.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middleware";

export const hierarchyRoutes = Router();

hierarchyRoutes.use(authenticate);
hierarchyRoutes.get("/", requirePermission("Employee Management", "canView"), controller.hierarchy);
hierarchyRoutes.post("/assign-manager", requirePermission("Employee Management", "canUpdate"), controller.assignManager);
