import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

export async function listProducts() { return prisma.product.findMany({ include: { category: true, inventory: true }, orderBy: { name: "asc" } }); }
export async function createProduct(data: Prisma.ProductUncheckedCreateInput) { return prisma.product.create({ data: { ...data, inventory: { create: {} } }, include: { inventory: true, category: true } }); }
export async function updateProduct(id: string, data: Prisma.ProductUncheckedUpdateInput) { return prisma.product.update({ where: { id }, data, include: { inventory: true, category: true } }).catch(() => { throw new AppError("Product not found", 404); }); }
export async function deleteProduct(id: string) { await prisma.product.delete({ where: { id } }).catch(() => { throw new AppError("Product not found", 404); }); }
export async function stock(productId: string, quantity: number, type: "IN" | "OUT") {
  return prisma.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({ where: { productId } });
    if (!inventory) throw new AppError("Product not found", 404);
    if (type === "OUT" && inventory.quantity < quantity) throw new AppError("Insufficient stock", 409);
    const updated = await tx.inventory.update({ where: { productId }, data: { quantity: { increment: type === "IN" ? quantity : -quantity } }, include: { product: true } });
    await tx.stockMovement.create({ data: { productId, quantity, type } });
    return updated;
  });
}
export async function inventory() { return prisma.inventory.findMany({ include: { product: { include: { category: true } } }, orderBy: { product: { name: "asc" } } }); }
export async function lowStock(threshold = 10) { return prisma.inventory.findMany({ where: { quantity: { lte: threshold } }, include: { product: true }, orderBy: { quantity: "asc" } }); }
type ContactData = { name: string; phone?: string };
function missing(resource: string) { throw new AppError(`${resource} not found`, 404); }
export const vendors = {
  list: () => prisma.vendor.findMany({ orderBy: { name: "asc" } }),
  create: (data: ContactData) => prisma.vendor.create({ data }),
  update: (id: string, data: Partial<ContactData>) => prisma.vendor.update({ where: { id }, data }).catch(() => missing("Vendor")),
  remove: (id: string) => prisma.vendor.delete({ where: { id } }).catch(() => missing("Vendor")),
};
export const customers = {
  list: () => prisma.customer.findMany({ orderBy: { name: "asc" } }),
  create: (data: ContactData) => prisma.customer.create({ data }),
  update: (id: string, data: Partial<ContactData>) => prisma.customer.update({ where: { id }, data }).catch(() => missing("Customer")),
  remove: (id: string) => prisma.customer.delete({ where: { id } }).catch(() => missing("Customer")),
};
