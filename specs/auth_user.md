# Feature: Authentication & User Context

## Description

Handles authentication and tenant context resolution.

## Actors

- Any user (DIRECTOR, COACH, PARENT, SUPER_ADMIN)

## Flow: Login

1. User provides:
   - email
   - password

2. System validates credentials

3. System retrieves memberships

4. User selects academy (if multiple)

5. System generates JWT

## JWT Payload

{
"user_id": number,
"academy_id": number,
"role": string
}

## Rules

- SUPER_ADMIN does not require academy_id
- All other users must operate within an academy context
- Every request must include JWT

## Authorization

- Access is determined by:
  - role
  - academy_id

## Edge Cases

- User has no memberships → reject
- Invalid password → reject
- Multiple academies → require selection

## Notes

- JWT is required for all protected endpoints
- Tenant context must be extracted from JWT
