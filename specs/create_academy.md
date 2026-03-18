# Feature: Create Academy

## Description

Allows SUPER_ADMIN to create a new academy and invite its director.

## Actors

- SUPER_ADMIN

## Preconditions

- User must have role SUPER_ADMIN

## Flow

1. SUPER_ADMIN creates academy with:
   - name
   - country
   - city
   - director_name
   - director_email

2. System creates:
   - Academy record
   - Invitation for DIRECTOR role

3. Invitation is sent via email (mock for MVP)

## Data Created

Academy:

- id
- name
- country
- city
- status = ACTIVE
- created_by_super_admin = true

Invitation:

- email
- academy_id
- role = DIRECTOR
- token
- expires_at

## Rules

- Only SUPER_ADMIN can create academies
- One academy must have at least one director
- Invitation must be unique per email + academy

## Edge Cases

- Email already exists → still allow invitation
- Duplicate academy name → allowed (no uniqueness constraint)

## Output

- Academy created
- Invitation created

## Notes

- No payments involved
- No self-signup allowed
