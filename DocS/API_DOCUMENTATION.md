# OfficeFlow API Documentation

All endpoints are rooted at `/api`, return `{ success, data }`, and require `Authorization: Bearer <access-token>` unless stated otherwise.

| Endpoint | Method | Body | Permission |
| --- | --- | --- | --- |
| `/attendance` | GET | - | Attendance view |
| `/attendance/check-in`, `/attendance/check-out` | POST | - | Authenticated employee |
| `/attendance/employee/:id` | GET | - | Attendance view |
| `/leaves` | GET | - | Leave Management view |
| `/leaves/request` | POST | `type`, `fromDate`, `toDate` | Authenticated employee |
| `/leaves/:id/approve`, `/leaves/:id/reject` | PUT | - | Super Admin, MD, Department Head |
| `/leaves/employee/:id` | GET | - | Leave Management view |
| `/products` | GET, POST | `name`, `sku`, optional `categoryId` | Warehouse view/create |
| `/products/:id` | PUT, DELETE | Product fields | Warehouse update/delete |
| `/inventory` | GET | - | Warehouse view |
| `/inventory/stock-in`, `/inventory/stock-out` | POST | `productId`, positive `quantity` | Warehouse update |
| `/inventory/low-stock` | GET | optional `threshold` query | Warehouse view |
| `/vendors`, `/customers` | GET, POST | `name`, optional `phone` | Warehouse view/create |
| `/vendors/:id`, `/customers/:id` | PUT, DELETE | `name`, optional `phone` | Warehouse update/delete |
| `/invoices` | GET, POST | `customerId`, `items[{productId,quantity,price}]` | Invoices view/create |
| `/invoices/:id` | GET | - | Invoices view |
| `/invoices/:id/pdf` | GET | - | Invoices view |

Success responses use the standard wrapper. Validation errors return 400, unknown records return 404, insufficient stock or invalid state transitions return 409, and authorization failures return 401 or 403. Interactive Swagger documentation is available at `/api/docs`.
