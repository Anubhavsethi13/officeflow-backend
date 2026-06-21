import { z } from "zod";

export const invoiceCreateSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.coerce.number().int().positive(), price: z.coerce.number().positive() })).min(1),
});
