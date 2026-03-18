# Multi-Tenant Architecture

Tenant definition:

- Each Academy is a tenant

Strategy:

- Shared database
- Logical isolation using academy_id

Rules:

- Every domain table must include academy_id
- Every query must filter by academy_id
- No cross-tenant data access allowed

Authentication:

JWT must include:

- user_id
- academy_id
- role

Example:

{
"user_id": 10,
"academy_id": 5,
"role": "COACH"
}

Membership Model:

User
↔ Membership
↔ Academy

This allows:

- coaches in multiple academies
- parents with children in multiple academies
