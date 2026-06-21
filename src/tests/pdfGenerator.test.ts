import assert from "node:assert/strict";
import test from "node:test";
import { invoicePdf } from "../utils/pdfGenerator";

test("invoicePdf creates a readable PDF document", () => {
  const pdf = invoicePdf({ invoiceNumber: "INV-1", createdAt: new Date("2026-06-22"), total: { toString: () => "99.00" }, customer: { name: "Test Customer", phone: null }, items: [{ quantity: 1, price: { toString: () => "99.00" }, product: { name: "Widget", sku: "W-1" } }] });
  assert.ok(pdf.subarray(0, 8).toString().startsWith("%PDF-1."));
  assert.ok(pdf.toString().includes("INV-1"));
});
