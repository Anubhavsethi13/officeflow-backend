import { z } from "zod";

export const employeeCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  departmentId: z.string().uuid().optional(),
  designation: z.string().min(2),
  joiningDate: z.coerce.date(),
  currentSalary: z.number().positive().optional(),
});

export const employeeUpdateSchema = employeeCreateSchema.partial().extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
});

export const assignManagerSchema = z.object({
  employeeId: z.string().uuid(),
  managerId: z.string().uuid(),
  level: z.number().int().positive().default(1),
});
