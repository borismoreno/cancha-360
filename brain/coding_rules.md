# Coding Rules

General:

- Use modular architecture (NestJS modules)
- Keep business logic inside services
- Controllers must be thin
- Use DTOs for validation
- Use Prisma for data access

Multi-tenant:

- Never query without academy_id
- Always use tenant context from JWT

Example:

❌ WRONG:
SELECT \* FROM players

✅ CORRECT:
SELECT \* FROM players WHERE academy_id = ?

Backend structure:

- modules/
- common/
- database/ (connection layer only, not schema)

Database schema is defined in:

- packages/database

Each module must include:

- controller
- service
- dto
