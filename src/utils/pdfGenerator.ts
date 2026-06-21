type InvoicePdf = { invoiceNumber: string; createdAt: Date; total: { toString(): string }; customer: { name: string; phone: string | null }; items: Array<{ quantity: number; price: { toString(): string }; product: { name: string; sku: string } }> };

const escapePdf = (value: string) => value.replace(/[\\()]/g, "\\$&");

export function invoicePdf(invoice: InvoicePdf) {
  const lines = ["OfficeFlow", `Invoice: ${invoice.invoiceNumber}`, `Date: ${invoice.createdAt.toISOString().slice(0, 10)}`, `Customer: ${invoice.customer.name}`, "", "Item | SKU | Qty | Unit Price | Line Total"];
  for (const item of invoice.items) lines.push(`${item.product.name} | ${item.product.sku} | ${item.quantity} | ${item.price.toString()} | ${(Number(item.price) * item.quantity).toFixed(2)}`);
  lines.push("", `Total: ${invoice.total.toString()}`);
  const content = `BT /F1 11 Tf 50 780 Td 15 TL ${lines.map((line, index) => `${index ? "T* " : ""}(${escapePdf(line)}) Tj`).join("\n")} ET`;
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`];
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}
