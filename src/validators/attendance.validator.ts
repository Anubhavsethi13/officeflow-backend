import { z } from "zod";

export const attendanceUpsertSchema = z.object({
  employeeId: z.string().uuid(),
  date: z.coerce.date(),
  status: z.enum(["PRESENT", "ABSENT", "HALF_DAY"]),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
});
