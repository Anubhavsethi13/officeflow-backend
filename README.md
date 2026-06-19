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
