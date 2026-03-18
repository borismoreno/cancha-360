# Feature: Invite & Accept User

## Description

Allows inviting users (DIRECTOR, COACH, PARENT) and accepting invitations.

## Actors

- SUPER_ADMIN
- DIRECTOR

## Flow: Invite User

1. Authenticated user (SUPER_ADMIN or DIRECTOR) sends invitation:
   - email
   - role (DIRECTOR, COACH, PARENT)
   - academy_id

2. System creates invitation with token

## Flow: Accept Invitation

1. User opens invitation link
2. Provides:
   - name
   - password

3. System creates:
   - User (if not exists)
   - Membership

## Data Created

User:

- id
- email
- password_hash
- name

Membership:

- user_id
- academy_id
- role
- status = ACTIVE

## Rules

- User can belong to multiple academies
- Role is scoped to academy
- Invitation expires after defined time

## Edge Cases

- User already exists → reuse user
- Invitation expired → reject
- Invalid token → reject

## Output

- User authenticated
- Membership created

## Notes

- JWT must include:
  - user_id
  - academy_id
  - role
