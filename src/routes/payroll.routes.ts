import { Router } from "express";
import * as controller from "../controllers/payroll.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middleware";

export const payrollRoutes = Router();

payrollRoutes.use(authenticate);
payrollRoutes.get("/history", requirePermission("Payroll", "canView"), controller.history);
payrollRoutes.get("/salary-graph", requirePermission("Payroll", "canView"), controller.salaryGraph);
