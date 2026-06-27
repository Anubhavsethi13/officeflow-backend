import { Request, Response } from "express";
import * as service from "../services/wms.service";
import { ok } from "../utils/response";
import { uuidParam } from "../validators/common";
import { customerSchema, productCreateSchema, productUpdateSchema, stockSchema, vendorSchema } from "../validators/wms.validator";

const id = (req: Request) => uuidParam.parse(req.params).id;
export async function products(_req: Request, res: Response) { return ok(res, await service.listProducts()); }
export async function createProduct(req: Request, res: Response) { return ok(res, await service.createProduct(productCreateSchema.parse(req.body)), 201); }
export async function updateProduct(req: Request, res: Response) { return ok(res, await service.updateProduct(id(req), productUpdateSchema.parse(req.body))); }
export async function removeProduct(req: Request, res: Response) { await service.deleteProduct(id(req)); return res.status(204).send(); }
export async function stockIn(req: Request, res: Response) { const data = stockSchema.parse(req.body); return ok(res, await service.stock(data.productId, data.quantity, "IN")); }
export async function stockOut(req: Request, res: Response) { const data = stockSchema.parse(req.body); return ok(res, await service.stock(data.productId, data.quantity, "OUT")); }
export async function inventory(_req: Request, res: Response) { return ok(res, await service.inventory()); }
export async function lowStock(req: Request, res: Response) { return ok(res, await service.lowStock(Number(req.query.threshold) || 10)); }
export async function movements(_req: Request, res: Response) { return ok(res, await service.movements()); }
function resourceController(resource: "vendors" | "customers", validator: typeof vendorSchema) { const api = service[resource]; return { list: async (_: Request, res: Response) => ok(res, await api.list()), create: async (req: Request, res: Response) => ok(res, await api.create(validator.parse(req.body)), 201), update: async (req: Request, res: Response) => ok(res, await api.update(id(req), validator.partial().parse(req.body))), remove: async (req: Request, res: Response) => { await api.remove(id(req)); return res.status(204).send(); } }; }
export const vendorController = resourceController("vendors", vendorSchema);
export const customerController = resourceController("customers", customerSchema);
