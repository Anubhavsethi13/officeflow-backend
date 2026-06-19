import { z } from "zod";

export const leaveRequestSchema = z.object({
  type: z.string().min(2),
  fromDate: z.coerce.date(),
  toDate: z.coerce.date(),
});

export const leaveApproveSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
});
