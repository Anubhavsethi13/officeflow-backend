# PostgreSQL Database Schema

## users

id UUID PK
email
password
role_id
employee_id
status


## roles

id
name


Roles:

SUPER_ADMIN
MD
DEPARTMENT_HEAD
PAYROLL_MANAGER
EMPLOYEE


## modules

id
module_name


## permissions

id
role_id
module_id

can_view
can_create
can_update
can_delete


## employees

id

name

phone

department_id

designation

joining_date

status


## employee_hierarchy

id

employee_id

manager_id

level


## attendance

id

employee_id

date

check_in

check_out

status


## leaves

id

employee_id

type

from_date

to_date

status


## salary_history

id

employee_id

old_salary

new_salary

increment_date


## tasks

id

title

description

department

created_by

assigned_to

status

priority

deadline


## task_history

id

task_id

updated_by

old_value

new_value

created_at


## WMS Tables

products

categories

inventory

stock_movements

vendors

customers

sales_invoices
