# Feature: Training + Evaluation

## Description

Allows COACH to create training sessions, record attendance, and evaluate players.
Parents can view player progress.

## Actors

- COACH
- PARENT

## Flow: Create Training

1. Coach creates training session:
   - team_id
   - date
   - duration
   - location

2. System creates TrainingSession

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

## Data Created

TrainingSession:

- id
- academy_id
- team_id
- date
- duration
- location

Attendance:

- player_id
- training_id
- status

Evaluation:

- player_id
- coach_id
- academy_id
- technical_score
- tactical_score
- physical_score
- attitude_score
- notes
- date

## Rules

- Coach must belong to academy
- Player must belong to same academy
- Scores must be between 1 and 10

## Edge Cases

- Evaluate player not in team → reject
- Missing scores → reject
- Duplicate attendance → update instead

## Output

- Training created
- Attendance recorded
- Evaluation stored

## Parent View

Parents can view:

- training history
- attendance
- evaluations
- progression over time

## Notes

- No advanced analytics required in MVP
