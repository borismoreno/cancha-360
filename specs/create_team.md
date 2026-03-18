# Feature: Create Team

## Description

Allows DIRECTOR to create teams and assign coaches.

## Actors

- DIRECTOR

## Preconditions

- User must belong to academy as DIRECTOR

## Flow

1. Director creates team with:
   - name (e.g., U10)
   - category (e.g., Under 10)
   - coach_id (optional)

2. System creates team

## Data Created

Team:

- id
- academy_id
- name
- category
- coach_id (nullable)

## Rules

- Team must belong to academy
- Coach must belong to same academy
- Multiple teams per academy allowed

## Edge Cases

- Assign coach from another academy → reject
- Duplicate team name → allowed

## Output

- Team created

## Notes

- Coach assignment can be updated later
