import { LeaveStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

export async function listLeaves() { return prisma.leave.findMany({ include: { employee: true }, orderBy: { fromDate: "desc" } }); }
export async function requestLeave(data: Prisma.LeaveUncheckedCreateInput) {
  const overlapping = await prisma.leave.findFirst({ where: { employeeId: data.employeeId, status: { in: ["PENDING", "APPROVED"] }, fromDate: { lte: data.toDate }, toDate: { gte: data.fromDate } } });
  if (overlapping) throw new AppError("Leave dates overlap an existing request", 409);
  return prisma.leave.create({ data });
}
export async function setLeaveStatus(id: string, status: LeaveStatus) {
  const leave = await prisma.leave.findUnique({ where: { id } });
  if (!leave) throw new AppError("Leave request not found", 404);
  if (leave.status !== "PENDING") throw new AppError("Only pending leave requests can be updated", 409);
  return prisma.leave.update({ where: { id }, data: { status } });
}
export async function employeeLeaves(employeeId: string) { return prisma.leave.findMany({ where: { employeeId }, orderBy: { fromDate: "desc" } }); }
