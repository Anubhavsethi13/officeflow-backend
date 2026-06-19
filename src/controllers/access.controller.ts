import { Request, Response } from "express";
import { prisma } from "../config/database";
import { ok } from "../utils/response";
import { uuidParam } from "../validators/common";
import { permissionSchema, permissionUpdateSchema } from "../validators/access.validator";

export async function modules(_req: Request, res: Response) {
  return ok(res, await prisma.module.findMany({ orderBy: { moduleName: "asc" } }));
}

export async function createPermission(req: Request, res: Response) {
  const data = permissionSchema.parse(req.body);
  const permission = await prisma.permission.upsert({
    where: { roleId_moduleId: { roleId: data.roleId, moduleId: data.moduleId } },
    update: data,
    create: data,
  });
  return ok(res, permission, 201);
}

export async function updatePermission(req: Request, res: Response) {
  const { id } = uuidParam.parse(req.params);
  const data = permissionUpdateSchema.parse(req.body);
  return ok(res, await prisma.permission.update({ where: { id }, data }));
}
