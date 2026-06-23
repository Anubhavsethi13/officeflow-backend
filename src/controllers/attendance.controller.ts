import { Request, Response } from "express";
import * as service from "../services/attendance.service";
import { ok } from "../utils/response";
import { AppError } from "../utils/app-error";
import { uuidParam } from "../validators/common";
import { attendanceUpsertSchema } from "../validators/attendance.validator";

const employeeId = (req: Request) => {
  const id = req.user?.employeeId || req.body.employeeId;
  if (!id) throw new AppError("Employee profile is required", 400);
  return id;
};
export async function list(_req: Request, res: Response) { return ok(res, await service.listAttendance()); }
export async function checkIn(req: Request, res: Response) { return ok(res, await service.checkIn(employeeId(req)), 201); }
export async function checkOut(req: Request, res: Response) { return ok(res, await service.checkOut(employeeId(req))); }
export async function employeeHistory(req: Request, res: Response) { return ok(res, await service.employeeAttendance(uuidParam.parse(req.params).id)); }
export async function upsert(req: Request, res: Response) {
  const data = attendanceUpsertSchema.parse(req.body);
  return ok(res, await service.upsertAttendance(data));
}
