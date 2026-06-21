import { Router } from "express";
import { accessRoutes } from "./access.routes";
import { authRoutes } from "./auth.routes";
import { employeeRoutes } from "./employee.routes";
import { hierarchyRoutes } from "./hierarchy.routes";
import { payrollRoutes } from "./payroll.routes";
import { profileRoutes } from "./profile.routes";
import { taskRoutes } from "./task.routes";
import { attendanceRoutes } from "./attendance.routes";
import { leaveRoutes } from "./leave.routes";
import { customerRoutes, inventoryRoutes, productRoutes, vendorRoutes } from "./wms.routes";
import { invoiceRoutes } from "./invoice.routes";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/employees", employeeRoutes);
apiRoutes.use("/hierarchy", hierarchyRoutes);
apiRoutes.use("/tasks", taskRoutes);
apiRoutes.use("/", accessRoutes);
apiRoutes.use("/", profileRoutes);
apiRoutes.use("/payroll", payrollRoutes);
apiRoutes.use("/attendance", attendanceRoutes);
apiRoutes.use("/leaves", leaveRoutes);
apiRoutes.use("/products", productRoutes);
apiRoutes.use("/inventory", inventoryRoutes);
apiRoutes.use("/vendors", vendorRoutes);
apiRoutes.use("/customers", customerRoutes);
apiRoutes.use("/invoices", invoiceRoutes);
