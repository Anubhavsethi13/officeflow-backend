import { Request, Response } from "express";
import * as service from "../services/leave.service";
import { AppError } from "../utils/app-error";
import { ok } from "../utils/response";
import { uuidParam } from "../validators/common";
import { leaveRequestSchema } from "../validators/leave.validator";

export async function list(_req: Request, res: Response) { return ok(res, await service.listLeaves()); }
export async function request(req: Request, res: Response) {
  const data = leaveRequestSchema.parse(req.body);
  const employeeId = data.employeeId || req.user?.employeeId;
  if (!employeeId) throw new AppError("Employee profile is required", 400);
  return ok(res, await service.requestLeave({ ...data, employeeId }), 201);
}
export async function approve(req: Request, res: Response) { return ok(res, await service.setLeaveStatus(uuidParam.parse(req.params).id, "APPROVED")); }
export async function reject(req: Request, res: Response) { return ok(res, await service.setLeaveStatus(uuidParam.parse(req.params).id, "REJECTED")); }
export async function employeeHistory(req: Request, res: Response) { return ok(res, await service.employeeLeaves(uuidParam.parse(req.params).id)); }
