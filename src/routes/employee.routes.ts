import { Router } from "express";
import * as controller from "../controllers/employee.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";

export const employeeRoutes = Router();

employeeRoutes.use(authenticate);
employeeRoutes.get("/", requirePermission("Employee Management", "canView"), controller.list);
employeeRoutes.post("/", requirePermission("Employee Management", "canCreate"), controller.create);
employeeRoutes.patch("/:id", requirePermission("Employee Management", "canUpdate"), controller.update);
employeeRoutes.delete("/:id", requirePermission("Employee Management", "canDelete"), controller.remove);
employeeRoutes.get("/:id/profile", requirePermission("Employee Portal", "canView"), controller.profile);
employeeRoutes.post("/:id/documents", requirePermission("Employee Management", "canUpdate"), upload.single("document"), controller.uploadDocument);
