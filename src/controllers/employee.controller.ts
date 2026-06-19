import { Request, Response } from "express";
import { prisma } from "../config/database";
import * as employeeService from "../services/employee.service";
import { AppError } from "../utils/app-error";
import { ok } from "../utils/response";
import { assignManagerSchema, employeeCreateSchema, employeeUpdateSchema } from "../validators/employee.validator";
import { uuidParam } from "../validators/common";

export async function list(req: Request, res: Response) {
  return ok(res, await employeeService.listEmployees(req.user));
}

export async function create(req: Request, res: Response) {
  const data = employeeCreateSchema.parse(req.body);
  return ok(res, await employeeService.createEmployee(data, req.user?.id), 201);
}

export async function update(req: Request, res: Response) {
  const { id } = uuidParam.parse(req.params);
  const data = employeeUpdateSchema.parse(req.body);
  return ok(res, await employeeService.updateEmployee(id, data, req.user?.id));
}

export async function remove(req: Request, res: Response) {
  const { id } = uuidParam.parse(req.params);
  return ok(res, await employeeService.disableEmployee(id, req.user?.id));
}

export async function profile(req: Request, res: Response) {
  const { id } = uuidParam.parse(req.params);
  return ok(res, await employeeService.getProfile(id, req.user));
}

export async function hierarchy(_req: Request, res: Response) {
  return ok(res, await prisma.employeeHierarchy.findMany({ include: { employee: true, manager: true } }));
}

export async function assignManager(req: Request, res: Response) {
  const data = assignManagerSchema.parse(req.body);
  if (data.employeeId === data.managerId) throw new AppError("Employee cannot manage themselves", 400);
  return ok(res, await employeeService.assignManager(data.employeeId, data.managerId, data.level), 201);
}

export async function uploadDocument(req: Request, res: Response) {
  const { id } = uuidParam.parse(req.params);
  if (!req.file) throw new AppError("Document file is required", 400);

  const document = await prisma.employeeDocument.create({
    data: {
      employeeId: id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    },
  });
  return ok(res, document, 201);
}
