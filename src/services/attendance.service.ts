import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

function startOfToday() { const date = new Date(); date.setHours(0, 0, 0, 0); return date; }

export async function listAttendance() { return prisma.attendance.findMany({ include: { employee: true }, orderBy: { date: "desc" } }); }
export async function checkIn(employeeId: string) {
  const date = startOfToday();
  const existing = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId, date } } });
  if (existing) throw new AppError("Employee has already checked in today", 409);
  return prisma.attendance.create({ data: { employeeId, date, checkIn: new Date(), status: "PRESENT" } });
}
export async function checkOut(employeeId: string) {
  const record = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId, date: startOfToday() } } });
  if (!record) throw new AppError("No check-in record found for today", 404);
  if (record.checkOut) throw new AppError("Employee has already checked out today", 409);
  return prisma.attendance.update({ where: { id: record.id }, data: { checkOut: new Date() } });
}
export async function employeeAttendance(employeeId: string) { return prisma.attendance.findMany({ where: { employeeId }, orderBy: { date: "desc" } }); }
