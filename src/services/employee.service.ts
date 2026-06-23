import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

function mapRoleName(role?: string | null): string {
  if (!role) return "EMPLOYEE";
  const upper = role.toUpperCase().replace(/\s+/g, "_");
  if (
    upper === "SUPER_ADMIN" ||
    upper === "MD" ||
    upper === "DEPARTMENT_HEAD" ||
    upper === "PAYROLL_MANAGER" ||
    upper === "EMPLOYEE"
  ) {
    return upper;
  }
  if (role === "Super Admin") return "SUPER_ADMIN";
  if (role === "Department Head") return "DEPARTMENT_HEAD";
  if (role === "Payroll Manager") return "PAYROLL_MANAGER";
  return "EMPLOYEE";
}

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

export async function createEmployee(input: any, userId?: string) {
  const { name, phone, departmentId, designation, joiningDate, currentSalary, email, password, role } = input;

  const employee = await prisma.employee.create({
    data: {
      name,
      phone,
      departmentId,
      designation,
      joiningDate: new Date(joiningDate),
      currentSalary,
    },
  });

  if (email) {
    const dbRoleName = mapRoleName(role);
    const roleRecord = await prisma.role.findUnique({ where: { name: dbRoleName } });
    if (!roleRecord) throw new AppError(`Role not found: ${dbRoleName}`, 400);
    const hashedPassword = await bcrypt.hash(password || "Employee@123", 12);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: roleRecord.id,
        employeeId: employee.id,
        status: "ACTIVE",
      },
    });
  }

  await prisma.auditLog.create({
    data: { userId, action: "CREATE", resource: "employee", metadata: { employeeId: employee.id } },
  });

  return prisma.employee.findUnique({
    where: { id: employee.id },
    include: { department: true, user: { select: { email: true, role: true, status: true } } },
  });
}

export async function updateEmployee(id: string, input: any, userId?: string) {
  const { name, phone, departmentId, designation, joiningDate, currentSalary, email, password, role, status } = input;

  const employeeData: any = {};
  if (name !== undefined) employeeData.name = name;
  if (phone !== undefined) employeeData.phone = phone;
  if (departmentId !== undefined) employeeData.departmentId = departmentId;
  if (designation !== undefined) employeeData.designation = designation;
  if (joiningDate !== undefined) employeeData.joiningDate = new Date(joiningDate);
  if (currentSalary !== undefined) {
    employeeData.currentSalary = currentSalary;
    const oldEmp = await prisma.employee.findUnique({ where: { id } });
    if (oldEmp && oldEmp.currentSalary !== null && Number(oldEmp.currentSalary) !== Number(currentSalary)) {
      await prisma.salaryHistory.create({
        data: {
          employeeId: id,
          oldSalary: oldEmp.currentSalary,
          newSalary: currentSalary,
          incrementDate: new Date(),
        },
      });
    }
  }
  if (status !== undefined) employeeData.status = status;

  const employee = await prisma.employee.update({
    where: { id },
    data: employeeData,
  });

  if (email || password || role || status) {
    const existingUser = await prisma.user.findUnique({ where: { employeeId: id } });
    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (password !== undefined && password) updateData.password = await bcrypt.hash(password, 12);
    if (status !== undefined) updateData.status = status;
    if (role !== undefined && role) {
      const dbRoleName = mapRoleName(role);
      const roleRecord = await prisma.role.findUnique({ where: { name: dbRoleName } });
      if (roleRecord) updateData.roleId = roleRecord.id;
    }

    if (existingUser) {
      await prisma.user.update({ where: { id: existingUser.id }, data: updateData });
    } else if (email) {
      const dbRoleName = mapRoleName(role);
      const roleRecord = await prisma.role.findUnique({ where: { name: dbRoleName } });
      const hashedPassword = await bcrypt.hash(password || "Employee@123", 12);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          roleId: roleRecord?.id || "",
          employeeId: id,
          status: "ACTIVE",
        },
      });
    }
  }

  await prisma.auditLog.create({
    data: { userId, action: "UPDATE", resource: "employee", metadata: { employeeId: id } },
  });

  return prisma.employee.findUnique({
    where: { id },
    include: { department: true, user: { select: { email: true, role: true, status: true } } },
  });
}

export async function disableEmployee(id: string, userId?: string) {
  const employee = await prisma.employee.update({
    where: { id },
    data: { status: "DISABLED", user: { update: { status: "DISABLED" } } },
  });
  await prisma.auditLog.create({
    data: { userId, action: "DISABLE", resource: "employee", metadata: { employeeId: id } },
  });
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
