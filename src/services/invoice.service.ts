import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { AppError } from "../utils/app-error";

type InvoiceInput = { customerId: string; items: Array<{ productId: string; quantity: number; price: number }> };
const details = { customer: true, items: { include: { product: true } } } as const;
export async function createInvoice(data: InvoiceInput) {
  return prisma.$transaction(async (tx) => {
    await tx.customer.findUniqueOrThrow({ where: { id: data.customerId } }).catch(() => { throw new AppError("Customer not found", 404); });
    const products = await tx.product.findMany({ where: { id: { in: data.items.map((item) => item.productId) } }, include: { inventory: true } });
    if (products.length !== new Set(data.items.map((item) => item.productId)).size) throw new AppError("One or more products were not found", 404);
    for (const item of data.items) { const stock = products.find((product) => product.id === item.productId)?.inventory?.quantity || 0; if (stock < item.quantity) throw new AppError("Insufficient stock for invoice", 409); }
    const total = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const invoice = await tx.salesInvoice.create({ data: { customerId: data.customerId, invoiceNumber: `INV-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, total: new Prisma.Decimal(total), items: { create: data.items.map((item) => ({ productId: item.productId, quantity: item.quantity, price: new Prisma.Decimal(item.price) })) } }, include: details });
    for (const item of data.items) { await tx.inventory.update({ where: { productId: item.productId }, data: { quantity: { decrement: item.quantity } } }); await tx.stockMovement.create({ data: { productId: item.productId, type: "OUT", quantity: item.quantity } }); }
    return invoice;
  });
}
export async function listInvoices() { return prisma.salesInvoice.findMany({ include: details, orderBy: { createdAt: "desc" } }); }
export async function invoiceById(id: string) { const invoice = await prisma.salesInvoice.findUnique({ where: { id }, include: details }); if (!invoice) throw new AppError("Invoice not found", 404); return invoice; }
