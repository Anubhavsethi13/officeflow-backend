import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ids = {
  uAdmin: "b3333333-3333-3333-3333-333333333333",
  uMd1: "b1111111-1111-1111-1111-111111111111",
  uMd2: "b2222222-2222-2222-2222-222222222222",
  uAcH: "b4444444-4444-4444-4444-444444444444",
  uSwH: "b5555555-5555-5555-5555-555555555555",
  uSw1: "b6666666-6666-6666-6666-666666666666",
  uSw2: "b7777777-7777-7777-7777-777777777777",
  uSupH: "b8888888-8888-8888-8888-888888888888",
  uHwH: "b9999999-9999-9999-9999-999999999999",
  uHw1: "baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  uCnH: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  uCn1: "cccccccc-cccc-cccc-cccc-cccccccccccc",
  uCn2: "dddddddd-dddd-dddd-dddd-dddddddddddd",
  oldAdmin: "e1111111-1111-1111-1111-111111111111",
  oldEmployee: "e2222222-2222-2222-2222-222222222222",
};

async function main() {
  const rolesList = ["SUPER_ADMIN", "MD", "MD2", "MD3", "DEPARTMENT_HEAD", "PAYROLL_MANAGER", "TEAM_LEAD", "EMPLOYEE"];
  const modules = ["Employee Management", "Task Management", "Payroll", "Employee Portal", "Access Control", "Dashboard", "Attendance", "Leave Management", "Warehouse Management", "Invoices"];

  console.log("Upserting roles...");
  for (const name of rolesList) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  console.log("Upserting modules...");
  for (const moduleName of modules) {
    await prisma.module.upsert({ where: { moduleName }, update: {}, create: { moduleName } });
  }

  const allRoles = await prisma.role.findMany();
  const allModules = await prisma.module.findMany();
  const roleByName = Object.fromEntries(allRoles.map((role) => [role.name, role]));

  console.log("Setting up role permissions...");
  for (const role of allRoles) {
    const isFull = ["SUPER_ADMIN", "MD", "MD2", "MD3"].includes(role.name);
    const allowed = isFull ? allModules : allModules.slice(0, 4);
    for (const mod of allowed) {
      await prisma.permission.upsert({
        where: { roleId_moduleId: { roleId: role.id, moduleId: mod.id } },
        update: {},
        create: {
          roleId: role.id,
          moduleId: mod.id,
          canView: true,
          canCreate: isFull || ["DEPARTMENT_HEAD", "PAYROLL_MANAGER"].includes(role.name),
          canUpdate: isFull || ["DEPARTMENT_HEAD", "PAYROLL_MANAGER"].includes(role.name),
          canDelete: isFull,
        },
      });
    }
  }

  console.log("Upserting departments...");
  const departmentsToSeed = ["Management", "Operations", "Support", "Software", "Hardware", "Accounts", "Consumables"];
  const depts: Record<string, any> = {};
  for (const deptName of departmentsToSeed) {
    depts[deptName] = await prisma.department.upsert({
      where: { name: deptName },
      update: {},
      create: { name: deptName },
    });
  }

  const hashedPassword = await bcrypt.hash("demo1234", 12);
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const employeePassword = await bcrypt.hash("Employee@123", 12);

  // List of employees to upsert
  const employeesData = [
    { id: ids.uAdmin, name: "Vrujen Andhare", phone: "+91 98765 43210", designation: "HR Director", departmentId: depts.Management.id, currentSalary: 150000, email: "vrujen.andhare@company.com", role: roleByName.SUPER_ADMIN.id },
    { id: ids.uMd1, name: "Rakesh Andhare", phone: "+91 98765 43210", designation: "Managing Director", departmentId: depts.Management.id, currentSalary: 165000, email: "rakesh.andhare@company.com", role: roleByName.MD.id },
    { id: ids.uMd2, name: "Sanjeevain Andhare", phone: "+91 98765 43210", designation: "Managing Director", departmentId: depts.Management.id, currentSalary: 165000, email: "sanjeevain.andhare@company.com", role: roleByName.MD2.id },
    { id: ids.uAcH, name: "Pankaj Vairagade", phone: "+91 98765 43210", designation: "Head of Accounts", departmentId: depts.Accounts.id, currentSalary: 95000, email: "pankaj.vairagade@company.com", role: roleByName.DEPARTMENT_HEAD.id },
    { id: ids.uSwH, name: "Kush Bhargava", phone: "+91 98765 43210", designation: "Technical Head", departmentId: depts.Software.id, currentSalary: 120000, email: "kush.bhargava@company.com", role: roleByName.DEPARTMENT_HEAD.id },
    { id: ids.uSw1, name: "Niraj Tete", phone: "+91 98765 43210", designation: "Software Developer Level 1", departmentId: depts.Software.id, currentSalary: 60000, email: "niraj.tete@company.com", role: roleByName.EMPLOYEE.id },
    { id: ids.uSw2, name: "Nikita Joshi", phone: "+91 98765 43210", designation: "Software Tester Level 1", departmentId: depts.Software.id, currentSalary: 50000, email: "nikita.joshi@company.com", role: roleByName.EMPLOYEE.id },
    { id: ids.uSupH, name: "Priyanka Paul", phone: "+91 98765 43210", designation: "Associate Software Engineer", departmentId: depts.Support.id, currentSalary: 85000, email: "priyanka.paul@company.com", role: roleByName.DEPARTMENT_HEAD.id },
    { id: ids.uHwH, name: "Praful Rane", phone: "+91 98765 43210", designation: "Field Manager", departmentId: depts.Hardware.id, currentSalary: 90000, email: "praful.rane@company.com", role: roleByName.DEPARTMENT_HEAD.id },
    { id: ids.uHw1, name: "Pankaj Shripad", phone: "+91 98765 43210", designation: "Associate Engineer", departmentId: depts.Hardware.id, currentSalary: 50000, email: "pankaj.shripad@company.com", role: roleByName.EMPLOYEE.id },
    { id: ids.uCnH, name: "Pammi Gour", phone: "+91 98765 43210", designation: "Senior Executive", departmentId: depts.Consumables.id, currentSalary: 80000, email: "pammi.gour@company.com", role: roleByName.DEPARTMENT_HEAD.id },
    { id: ids.uCn1, name: "Mukesh Sawarkar", phone: "+91 98765 43210", designation: "Junior Executive", departmentId: depts.Consumables.id, currentSalary: 45000, email: "mukesh.sawarkar@company.com", role: roleByName.EMPLOYEE.id },
    { id: ids.uCn2, name: "Nitin Pande", phone: "+91 98765 43210", designation: "Junior Executive", departmentId: depts.Consumables.id, currentSalary: 45000, email: "nitin.pande@company.com", role: roleByName.EMPLOYEE.id },
    // Also include old seed admin/employee as fallback options
    { id: ids.oldAdmin, name: "OfficeFlow Admin", phone: "9999999999", designation: "Super Admin", departmentId: depts.Management.id, currentSalary: 150000, email: "admin@officeflow.test", role: roleByName.SUPER_ADMIN.id },
    { id: ids.oldEmployee, name: "Aarav Mehta", phone: "8888888888", designation: "Operations Executive", departmentId: depts.Operations.id, currentSalary: 55000, email: "employee@officeflow.test", role: roleByName.EMPLOYEE.id }
  ];

  console.log("Upserting employees and user credentials...");
  for (const emp of employeesData) {
    const employee = await prisma.employee.upsert({
      where: { id: emp.id },
      update: {
        name: emp.name,
        phone: emp.phone,
        designation: emp.designation,
        departmentId: emp.departmentId,
        currentSalary: emp.currentSalary,
      },
      create: {
        id: emp.id,
        name: emp.name,
        phone: emp.phone,
        designation: emp.designation,
        departmentId: emp.departmentId,
        joiningDate: new Date("2023-04-15"),
        currentSalary: emp.currentSalary,
      },
    });

    const isOldTestAdmin = emp.email === "admin@officeflow.test";
    const isOldTestEmp = emp.email === "employee@officeflow.test";
    const pass = isOldTestAdmin ? adminPassword : isOldTestEmp ? employeePassword : hashedPassword;

    await prisma.user.upsert({
      where: { email: emp.email },
      update: {
        roleId: emp.role,
        employeeId: employee.id,
      },
      create: {
        email: emp.email,
        password: pass,
        roleId: emp.role,
        employeeId: employee.id,
      },
    });
  }

  console.log("Updating reporting manager hierarchies...");
  const hierarchies = [
    { employeeId: ids.uAcH, managerId: ids.uMd1 },
    { employeeId: ids.uSwH, managerId: ids.uMd2 },
    { employeeId: ids.uSw1, managerId: ids.uSwH },
    { employeeId: ids.uSw2, managerId: ids.uSwH },
    { employeeId: ids.uSupH, managerId: ids.uAdmin },
    { employeeId: ids.uHwH, managerId: ids.uMd1 },
    { employeeId: ids.uHw1, managerId: ids.uHwH },
    { employeeId: ids.uCnH, managerId: ids.uMd2 },
    { employeeId: ids.uCn1, managerId: ids.uCnH },
    { employeeId: ids.uCn2, managerId: ids.uCnH },
    { employeeId: ids.oldEmployee, managerId: ids.oldAdmin },
  ];

  for (const h of hierarchies) {
    await prisma.employeeHierarchy.upsert({
      where: { employeeId_managerId: { employeeId: h.employeeId, managerId: h.managerId } },
      update: {},
      create: {
        employeeId: h.employeeId,
        managerId: h.managerId,
        level: 1,
      },
    });
  }

  // Seed static category and basic products
  console.log("Seeding static consumables WMS data...");
  const officeSupplies = await prisma.category.upsert({
    where: { name: "Office Supplies" },
    update: {},
    create: { name: "Office Supplies" }
  });

  const products = [
    { sku: "p-tnr-1", name: "Laser Jet Toner", categoryId: officeSupplies.id },
    { sku: "p-roll-1", name: "Paper Roll 80mm", categoryId: officeSupplies.id },
    { sku: "p-lap-1", name: "Developer Laptop", categoryId: officeSupplies.id },
    { sku: "p-prn-1", name: "Receipt Printer", categoryId: officeSupplies.id },
    { sku: "p-lbl-1", name: "Barcode Labels", categoryId: officeSupplies.id },
    { sku: "p-roll-2", name: "Paper Roll 57mm", categoryId: officeSupplies.id },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: { name: p.name, categoryId: p.categoryId },
      create: { sku: p.sku, name: p.name, categoryId: p.categoryId }
    });

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: { productId: product.id, quantity: 100 }
    });
  }

  await prisma.vendor.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: { id: "00000000-0000-0000-0000-000000000001", name: "Default Vendor", phone: "7777777777" }
  });

  await prisma.customer.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: { id: "00000000-0000-0000-0000-000000000002", name: "Default Customer", phone: "6666666666" }
  });

  console.log("Seed completed. You can login as any of the 13 employees using password 'demo1234'.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
