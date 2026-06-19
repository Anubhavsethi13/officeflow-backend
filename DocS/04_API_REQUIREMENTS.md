# API Requirements


## AUTH

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/me


## EMPLOYEE

GET /api/employees

POST /api/employees

PATCH /api/employees/:id

DELETE /api/employees/:id


GET /api/employees/:id/profile


## HIERARCHY

GET /api/hierarchy

POST /api/hierarchy/assign-manager


## ACCESS CONTROL

GET /api/modules

POST /api/permissions

PATCH /api/permissions/:id


## TASK

GET /api/tasks

POST /api/tasks

PATCH /api/tasks/:id


POST /api/tasks/:id/assign


GET /api/tasks/:id/history


## ATTENDANCE

POST /api/attendance/checkin

POST /api/attendance/checkout


## LEAVE

POST /api/leaves/request

PATCH /api/leaves/approve


## PAYROLL

GET /api/payroll/history

GET /api/payroll/salary-graph


## DASHBOARD

GET /api/dashboard/stats
