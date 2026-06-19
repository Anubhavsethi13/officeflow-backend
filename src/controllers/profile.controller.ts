import { Request, Response } from "express";
import * as profileService from "../services/profile.service";
import { AppError } from "../utils/app-error";
import { ok } from "../utils/response";
import { leaveApproveSchema, leaveRequestSchema } from "../validators/profile.validator";

function employeeId(req: Request) {
  if (!req.user?.employeeId) throw new AppError("Employee profile is required", 400);
  return req.user.employeeId;
}

export async function checkIn(req: Request, res: Response) {
  return ok(res, await profileService.checkIn(employeeId(req)), 201);
}

export async function checkOut(req: Request, res: Response) {
  return ok(res, await profileService.checkOut(employeeId(req)));
}

export async function requestLeave(req: Request, res: Response) {
  const data = leaveRequestSchema.parse(req.body);
  return ok(res, await profileService.requestLeave(employeeId(req), data), 201);
}

export async function approveLeave(req: Request, res: Response) {
  const data = leaveApproveSchema.parse(req.body);
  return ok(res, await profileService.approveLeave(data.id, data.status));
}

export async function dashboardStats(_req: Request, res: Response) {
  return ok(res, await profileService.dashboardStats());
}
