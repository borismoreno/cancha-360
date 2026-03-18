# Feature: Register Player

## Description

Allows COACH or DIRECTOR to register players and link parents.

## Actors

- COACH
- DIRECTOR

## Preconditions

- User must belong to academy

## Flow

1. User creates player with:
   - name
   - birthdate
   - position
   - team_id

2. Optionally link parent:
   - parent_name
   - parent_email

3. System:
   - creates Player
   - creates User (parent) if not exists
   - creates Membership (PARENT)
   - creates PlayerGuardian relation

## Data Created

Player:

- id
- academy_id
- team_id
- name
- birthdate
- position

PlayerGuardian:

- player_id
- user_id
- relationship (optional)

## Rules

- Player belongs to ONE academy (MVP constraint)
- Player must belong to a team
- Parent can have multiple players

## Edge Cases

- Parent already exists → reuse user
- Player without parent → allowed
- Invalid team_id → reject

## Output

- Player created
- Parent linked (optional)

## Notes

- Parent login handled via invitation or later onboarding
