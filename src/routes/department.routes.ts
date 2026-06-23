import { Router } from "express";
import { prisma } from "../config/database";
import { ok } from "../utils/response";
import { authenticate } from "../middlewares/auth.middleware";

export const departmentRoutes = Router();

departmentRoutes.use(authenticate);
departmentRoutes.get("/", async (req, res) => {
  const departments = await prisma.department.findMany({ orderBy: { name: "asc" } });
  return ok(res, departments);
});
