import { z } from "zod";

export const productCreateSchema = z.object({ name: z.string().trim().min(1), sku: z.string().trim().min(1), categoryId: z.string().uuid().optional() });
export const productUpdateSchema = productCreateSchema.partial();
export const stockSchema = z.object({ productId: z.string().uuid(), quantity: z.coerce.number().int().positive() });
export const vendorSchema = z.object({ name: z.string().trim().min(1), phone: z.string().trim().min(3).max(30).optional() });
export const customerSchema = vendorSchema;
