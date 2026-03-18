# System Architecture

Architecture Style:

- Modular Monolith (initial phase)

Backend:

- NestJS

Frontend:

- React (Vite)

Database:

- PostgreSQL

ORM:

- Prisma (centralized in packages/database)

Infrastructure:

- Neon (PostgreSQL provider)

Authentication:

- JWT-based

Multi-tenancy model:

- Shared database
- Tenant isolation via academy_id
- Membership-based access control

Important:

- All domain tables must include academy_id
- Tenant context must be enforced in every query
