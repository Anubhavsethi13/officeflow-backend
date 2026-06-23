import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

function startOfToday() { const date = new Date(); date.setHours(0, 0, 0, 0); return date; }
function startOfDate(value: Date) { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; }

export async function listAttendance() { return prisma.attendance.findMany({ include: { employee: true }, orderBy: { date: "desc" } }); }
export async function checkIn(employeeId: string) {
  const date = startOfToday();
  return prisma.attendance.upsert({
    where: { employeeId_date: { employeeId, date } },
    update: {},
    create: { employeeId, date, checkIn: new Date(), status: "PRESENT" },
  });
}
export async function checkOut(employeeId: string) {
  const date = startOfToday();
  const record = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId, date } } });
  if (!record) throw new AppError("No check-in record found for today", 404);
  if (record.checkOut) return record;
  return prisma.attendance.update({ where: { id: record.id }, data: { checkOut: new Date() } });
}
export async function employeeAttendance(employeeId: string) { return prisma.attendance.findMany({ where: { employeeId }, orderBy: { date: "desc" } }); }
export async function upsertAttendance(input: { employeeId: string; date: Date; status: "PRESENT" | "ABSENT" | "HALF_DAY"; checkIn?: Date; checkOut?: Date }) {
  const date = startOfDate(input.date);
  const existing = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId: input.employeeId, date } } });

  if (input.checkOut && !input.checkIn && !existing?.checkIn) {
    throw new AppError("checkIn is required before checkOut", 400);
  }

  if (input.checkIn && input.checkOut && input.checkOut <= input.checkIn) {
    throw new AppError("checkOut must be after checkIn", 400);
  }

  if (existing) {
    const nextCheckIn = input.checkIn === undefined ? existing.checkIn : input.checkIn;
    const nextCheckOut = input.checkOut === undefined ? existing.checkOut : input.checkOut;
    if (nextCheckIn && nextCheckOut && nextCheckOut <= nextCheckIn) {
      throw new AppError("checkOut must be after checkIn", 400);
    }
    return prisma.attendance.update({
      where: { id: existing.id },
      data: { status: input.status, checkIn: nextCheckIn, checkOut: nextCheckOut },
      include: { employee: true },
    });
  }

  return prisma.attendance.create({
    data: { employeeId: input.employeeId, date, status: input.status, checkIn: input.checkIn, checkOut: input.checkOut },
    include: { employee: true },
  });
}
