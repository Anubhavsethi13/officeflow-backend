# OfficeFlow Backend API

Production-ready Node.js, Express, TypeScript, PostgreSQL, and Prisma API for OfficeFlow ERP.

## Setup

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL or run `docker compose up postgres`.
3. Install dependencies with `npm install`.
4. Run `npx prisma migrate dev`.
5. Seed demo data with `npx prisma db seed`.
6. Start the API with `npm run dev`.

Seed admin login:

```text
email: admin@officeflow.test
password: Admin@123
```

Swagger docs are available at `/api/docs`.

## Completed modules

- Attendance: check-in, check-out, and attendance history.
- Leave management: request, approve, reject, and employee history.
- Warehouse: products, inventory stock movements, low-stock alerts, vendors, and customers.
- Invoices: transactional stock deduction, total calculation, payment state, and PDF download.

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoints, request bodies, and permissions.

## Render deployment

The repository includes `render.yaml`. Connect the repository in Render and set `DATABASE_URL` to the managed PostgreSQL connection string and `CORS_ORIGIN` to the deployed frontend origin. Render generates JWT secrets from the blueprint. The build command is `npm ci && npx prisma generate && npm run build`; startup runs `npx prisma migrate deploy && npm start`. Verify `/health` and `/api/docs` after deployment.
