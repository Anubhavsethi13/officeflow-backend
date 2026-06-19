import { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { AppError } from "../utils/app-error";
import { ok } from "../utils/response";
import { uuidParam } from "../validators/common";
import { taskAssignSchema, taskCreateSchema, taskUpdateSchema } from "../validators/task.validator";

function currentEmployeeId(req: Request) {
  if (!req.user?.employeeId) throw new AppError("Employee profile is required", 400);
  return req.user.employeeId;
}

export async function list(req: Request, res: Response) {
  return ok(res, await taskService.listTasks(req.user));
}

export async function create(req: Request, res: Response) {
  const data = taskCreateSchema.parse(req.body);
  return ok(res, await taskService.createTask({ ...data, createdBy: currentEmployeeId(req) }, req.user?.id), 201);
}

export async function update(req: Request, res: Response) {
  const { id } = uuidParam.parse(req.params);
  const data = taskUpdateSchema.parse(req.body);
  return ok(res, await taskService.updateTask(id, data, currentEmployeeId(req)));
}

export async function assign(req: Request, res: Response) {
  const { id } = uuidParam.parse(req.params);
  const data = taskAssignSchema.parse(req.body);
  return ok(res, await taskService.updateTask(id, { assignedTo: data.assignedTo }, currentEmployeeId(req)));
}

export async function history(req: Request, res: Response) {
  const { id } = uuidParam.parse(req.params);
  return ok(res, await taskService.getTaskHistory(id));
}
