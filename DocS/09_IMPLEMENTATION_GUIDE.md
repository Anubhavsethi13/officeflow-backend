# Backend Implementation Guide


Architecture:

Controller
↓
Service
↓
Prisma Repository
↓
PostgreSQL


Required:

- Models
- Controllers
- Routes
- Middleware
- Validators
- Comments


Setup:

npm install


Database:

npx prisma migrate dev


Seed demo data:

npx prisma db seed


Run:

npm run dev
