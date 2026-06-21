CREATE TYPE "InvoicePaymentStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

ALTER TABLE "sales_invoices"
  ADD COLUMN "invoice_number" TEXT,
  ADD COLUMN "payment_status" "InvoicePaymentStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0;

UPDATE "sales_invoices"
SET "invoice_number" = CONCAT('INV-', TO_CHAR("created_at", 'YYYYMMDD'), '-', SUBSTRING("id"::TEXT, 1, 8))
WHERE "invoice_number" IS NULL;

ALTER TABLE "sales_invoices"
  ALTER COLUMN "invoice_number" SET NOT NULL,
  ADD CONSTRAINT "sales_invoices_invoice_number_key" UNIQUE ("invoice_number");
