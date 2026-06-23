import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = ["SUPER_ADMIN", "MD", "DEPARTMENT_HEAD", "PAYROLL_MANAGER", "EMPLOYEE"];
  const modules = ["Employee Management", "Task Management", "Payroll", "Employee Portal", "Access Control", "Dashboard", "Attendance", "Leave Management", "Warehouse Management", "Invoices"];

  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  for (const moduleName of modules) {
    await prisma.module.upsert({ where: { moduleName }, update: {}, create: { moduleName } });
  }

  const allRoles = await prisma.role.findMany();
  const allModules = await prisma.module.findMany();
  const roleByName = Object.fromEntries(allRoles.map((role) => [role.name, role]));
  const moduleByName = Object.fromEntries(allModules.map((mod) => [mod.moduleName, mod]));

  for (const role of allRoles) {
    const allowed = role.name === "SUPER_ADMIN" ? allModules : allModules.slice(0, 4);
    for (const mod of allowed) {
      const full = role.name === "SUPER_ADMIN";
      await prisma.permission.upsert({
        where: { roleId_moduleId: { roleId: role.id, moduleId: mod.id } },
        update: {},
        create: {
          roleId: role.id,
          moduleId: mod.id,
          canView: true,
          canCreate: full || ["DEPARTMENT_HEAD", "PAYROLL_MANAGER"].includes(role.name),
          canUpdate: full || ["DEPARTMENT_HEAD", "PAYROLL_MANAGER"].includes(role.name),
          canDelete: full,
        },
      });
    }
  }

  const management = await prisma.department.upsert({
    where: { name: "Management" },
    update: {},
    create: { name: "Management" },
  });
  const operations = await prisma.department.upsert({
    where: { name: "Operations" },
    update: {},
    create: { name: "Operations" },
  });
  
  const depts = ["Support", "Software", "Hardware", "Accounts", "Consumables"];
  for (const deptName of depts) {
    await prisma.department.upsert({
      where: { name: deptName },
      update: {},
      create: { name: deptName },
    });
  }

  const adminEmployee = await prisma.employee.create({
    data: {
      name: "OfficeFlow Admin",
      phone: "9999999999",
      designation: "Super Admin",
      joiningDate: new Date("2024-01-01"),
      departmentId: management.id,
      currentSalary: 150000,
    },
  });

  const employee = await prisma.employee.create({
    data: {
      name: "Aarav Mehta",
      phone: "8888888888",
      designation: "Operations Executive",
      joiningDate: new Date("2024-03-15"),
      departmentId: operations.id,
      currentSalary: 55000,
    },
  });

  await prisma.employeeHierarchy.create({
    data: { employeeId: employee.id, managerId: adminEmployee.id, level: 1 },
  });

  await prisma.user.upsert({
    where: { email: "admin@officeflow.test" },
    update: {},
    create: {
      email: "admin@officeflow.test",
      password: await bcrypt.hash("Admin@123", 12),
      roleId: roleByName.SUPER_ADMIN.id,
      employeeId: adminEmployee.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "employee@officeflow.test" },
    update: {},
    create: {
      email: "employee@officeflow.test",
      password: await bcrypt.hash("Employee@123", 12),
      roleId: roleByName.EMPLOYEE.id,
      employeeId: employee.id,
    },
  });

  await prisma.salaryHistory.create({
    data: {
      employeeId: employee.id,
      oldSalary: 50000,
      newSalary: 55000,
      incrementDate: new Date("2025-01-01"),
    },
  });

  await prisma.task.create({
    data: {
      title: "Prepare monthly operations report",
      description: "Compile department metrics for leadership review.",
      department: "Operations",
      createdBy: adminEmployee.id,
      assignedTo: employee.id,
      priority: "HIGH",
      deadline: new Date("2026-07-01"),
    },
  });

  await prisma.category.create({ data: { name: "Office Supplies" } }).catch(() => undefined);
  await prisma.vendor.create({ data: { name: "Default Vendor", phone: "7777777777" } });
  await prisma.customer.create({ data: { name: "Default Customer", phone: "6666666666" } });

  console.log("Seed completed. Admin: admin@officeflow.test / Admin@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
