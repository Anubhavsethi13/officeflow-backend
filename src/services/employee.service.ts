import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

export async function listEmployees(user?: Express.User) {
  const where: Prisma.EmployeeWhereInput = {};
  if (user?.role === "EMPLOYEE" && user.employeeId) {
    where.id = user.employeeId;
  }

  return prisma.employee.findMany({
    where,
    include: { department: true, user: { select: { email: true, role: true, status: true } } },
    orderBy: { name: "asc" },
  });
}

export async function createEmployee(data: Prisma.EmployeeUncheckedCreateInput, userId?: string) {
  const employee = await prisma.employee.create({ data });
  await prisma.auditLog.create({ data: { userId, action: "CREATE", resource: "employee", metadata: { employeeId: employee.id } } });
  return employee;
}

export async function updateEmployee(id: string, data: Prisma.EmployeeUncheckedUpdateInput, userId?: string) {
  const employee = await prisma.employee.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { userId, action: "UPDATE", resource: "employee", metadata: { employeeId: id } } });
  return employee;
}

export async function disableEmployee(id: string, userId?: string) {
  const employee = await prisma.employee.update({ where: { id }, data: { status: "DISABLED", user: { update: { status: "DISABLED" } } } });
  await prisma.auditLog.create({ data: { userId, action: "DISABLE", resource: "employee", metadata: { employeeId: id } } });
  return employee;
}

export async function getProfile(id: string, user?: Express.User) {
  if (user?.role === "EMPLOYEE" && user.employeeId !== id) {
    throw new AppError("Access denied", 403);
  }

  const profile = await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      attendance: { orderBy: { date: "desc" } },
      leaves: { orderBy: { fromDate: "desc" } },
      salaryHistory: { orderBy: { incrementDate: "asc" } },
      assignedTasks: true,
      documents: true,
    },
  });

  if (!profile) {
    throw new AppError("Employee not found", 404);
  }

  return profile;
}

export async function assignManager(employeeId: string, managerId: string, level: number) {
  return prisma.employeeHierarchy.upsert({
    where: { employeeId_managerId: { employeeId, managerId } },
    update: { level },
    create: { employeeId, managerId, level },
  });
}
