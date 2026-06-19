import { z } from "zod";

export const taskCreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  department: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  deadline: z.coerce.date().optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  department: z.string().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  deadline: z.coerce.date().nullable().optional(),
});

export const taskAssignSchema = z.object({ assignedTo: z.string().uuid() });
