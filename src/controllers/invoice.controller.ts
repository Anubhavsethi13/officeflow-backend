import { Request, Response } from "express";
import * as service from "../services/invoice.service";
import { invoicePdf } from "../utils/pdfGenerator";
import { ok } from "../utils/response";
import { uuidParam } from "../validators/common";
import { invoiceCreateSchema } from "../validators/invoice.validator";
export async function create(req: Request, res: Response) { return ok(res, await service.createInvoice(invoiceCreateSchema.parse(req.body)), 201); }
export async function list(_req: Request, res: Response) { return ok(res, await service.listInvoices()); }
export async function get(req: Request, res: Response) { return ok(res, await service.invoiceById(uuidParam.parse(req.params).id)); }
export async function pdf(req: Request, res: Response) { const invoice = await service.invoiceById(uuidParam.parse(req.params).id); res.type("application/pdf").attachment(`${invoice.invoiceNumber}.pdf`).send(invoicePdf(invoice)); }
