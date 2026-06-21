import { z } from "zod";

export const leaveRequestSchema = z.object({
  employeeId: z.string().uuid().optional(),
  type: z.string().trim().min(2).max(80),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
}).refine((value) => value.toDate >= value.fromDate, { message: "toDate must be on or after fromDate", path: ["toDate"] });
