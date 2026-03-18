# Feature: Training Schedule + Sessions

## Description

Allows coaches to define recurring training schedules and manage individual sessions.

## Actors

- COACH

## Flow: Create Training Schedule

1. Coach defines:
   - team_id
   - days_of_week (e.g., MON, WED, FRI)
   - time (e.g., 19:30)
   - start_date
   - end_date
   - location

2. System creates TrainingSchedule

3. System generates TrainingSessions automatically

## Data Created

TrainingSchedule:

- id
- academy_id
- team_id
- days_of_week (array)
- time
- start_date
- end_date
- location

TrainingSession:

- id
- academy_id
- team_id
- date
- status (SCHEDULED, CANCELLED)

## Flow: Cancel Session

1. Coach selects a session
2. Marks as CANCELLED
3. Adds reason (optional)

## Flow: Record Attendance

1. Coach marks attendance per player:
   - player_id
   - status (PRESENT, ABSENT)

## Flow: Evaluate Player

1. Coach evaluates player:
   - technical_score (1–10)
   - tactical_score (1–10)
   - physical_score (1–10)
   - attitude_score (1–10)
   - notes

2. System stores evaluation

## Rules

- Sessions must be generated within date range
- Only coach of team can manage schedule
- Cancelled sessions cannot have attendance

## Edge Cases

- Overlapping schedules → allowed
- Cancel same session twice → ignore
- Invalid date range → reject

## Parent View

Parents can see:

- upcoming trainings
- cancelled sessions
- attendance
- evaluations

## Notes

- Sessions are generated automatically
- No manual creation required in MVP
