import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function checkIn(employeeId: string) {
  return prisma.attendance.upsert({
    where: { employeeId_date: { employeeId, date: startOfToday() } },
    update: { checkIn: new Date(), status: "PRESENT" },
    create: { employeeId, date: startOfToday(), checkIn: new Date(), status: "PRESENT" },
  });
}

export async function checkOut(employeeId: string) {
  const record = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId, date: startOfToday() } } });
  if (!record) throw new AppError("Check-in required before checkout", 400);
  return prisma.attendance.update({ where: { id: record.id }, data: { checkOut: new Date() } });
}

export async function requestLeave(employeeId: string, data: { type: string; fromDate: Date; toDate: Date }) {
  return prisma.leave.create({ data: { employeeId, ...data } });
}

export async function approveLeave(id: string, status: "APPROVED" | "REJECTED") {
  return prisma.leave.update({ where: { id }, data: { status } });
}

export async function payrollHistory(employeeId?: string) {
  return prisma.salaryHistory.findMany({
    where: employeeId ? { employeeId } : {},
    include: { employee: true },
    orderBy: { incrementDate: "desc" },
  });
}

export async function dashboardStats() {
  const [employees, tasks, pendingLeaves, todayAttendance] = await Promise.all([
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.task.count(),
    prisma.leave.count({ where: { status: "PENDING" } }),
    prisma.attendance.count({ where: { date: startOfToday() } }),
  ]);
  return { employees, tasks, pendingLeaves, todayAttendance };
}
