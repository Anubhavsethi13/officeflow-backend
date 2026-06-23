import { z } from "zod";

export const employeeCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional().nullable(),
  departmentId: z.string().uuid().optional().nullable(),
  designation: z.string().min(2),
  joiningDate: z.coerce.date(),
  currentSalary: z.number().positive().optional().nullable(),
  email: z.string().email().optional().nullable(),
  password: z.string().min(6).optional().nullable(),
  role: z.enum([
    "Super Admin",
    "MD",
    "Department Head",
    "Payroll Manager",
    "Employee",
    "SUPER_ADMIN",
    "MD",
    "DEPARTMENT_HEAD",
    "PAYROLL_MANAGER",
    "EMPLOYEE",
  ]).optional().nullable(),
});

export const employeeUpdateSchema = employeeCreateSchema.partial().extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
});

export const assignManagerSchema = z.object({
  employeeId: z.string().uuid(),
  managerId: z.string().uuid(),
  level: z.number().int().positive().default(1),
});
