# Domain Model

Core Entities:

- User
- Academy
- Membership
- Team
- Player
- PlayerGuardian
- TrainingSession
- Attendance
- Evaluation
- Invitation

Relationships:

User
└── Membership
└── Academy

Academy
└── Teams
└── Players

Player
└── PlayerGuardian
└── User (Parent)

Team
└── TrainingSession
└── Attendance
└── Player

Player
└── Evaluation
└── Coach (User)

Key Rules:

- A user can belong to multiple academies
- A user can have different roles per academy
- A player belongs to one academy (MVP constraint)
- Future: player can belong to multiple academies via membership
- A player can have multiple guardians (parents)
- Coaches and parents are users with roles via Membership
