import { Router } from "express";
import * as controller from "../controllers/wms.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middleware";
const permissions = (action: "canView" | "canCreate" | "canUpdate" | "canDelete") => requirePermission("Warehouse Management", action);
export const productRoutes = Router(); export const inventoryRoutes = Router(); export const vendorRoutes = Router(); export const customerRoutes = Router();
for (const router of [productRoutes, inventoryRoutes, vendorRoutes, customerRoutes]) router.use(authenticate);
productRoutes.get("/", permissions("canView"), controller.products); productRoutes.post("/", permissions("canCreate"), controller.createProduct); productRoutes.put("/:id", permissions("canUpdate"), controller.updateProduct); productRoutes.delete("/:id", permissions("canDelete"), controller.removeProduct);
inventoryRoutes.get("/", permissions("canView"), controller.inventory); inventoryRoutes.get("/low-stock", permissions("canView"), controller.lowStock); inventoryRoutes.get("/movements", permissions("canView"), controller.movements); inventoryRoutes.post("/stock-in", permissions("canUpdate"), controller.stockIn); inventoryRoutes.post("/stock-out", permissions("canUpdate"), controller.stockOut);
for (const [router, api] of [[vendorRoutes, controller.vendorController], [customerRoutes, controller.customerController]] as const) { router.get("/", permissions("canView"), api.list); router.post("/", permissions("canCreate"), api.create); router.put("/:id", permissions("canUpdate"), api.update); router.delete("/:id", permissions("canDelete"), api.remove); }
