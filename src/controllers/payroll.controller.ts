import { Request, Response } from "express";
import * as profileService from "../services/profile.service";
import { ok } from "../utils/response";

export async function history(req: Request, res: Response) {
  const employeeId = req.user?.role === "EMPLOYEE" ? req.user.employeeId || undefined : undefined;
  return ok(res, await profileService.payrollHistory(employeeId));
}

export async function salaryGraph(req: Request, res: Response) {
  const employeeId = req.user?.role === "EMPLOYEE" ? req.user.employeeId || undefined : undefined;
  const historyRows = await profileService.payrollHistory(employeeId);
  return ok(
    res,
    historyRows.map((row) => ({
      employeeId: row.employeeId,
      date: row.incrementDate,
      salary: row.newSalary,
    })),
  );
}
