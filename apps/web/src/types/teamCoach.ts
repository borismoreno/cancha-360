export interface AddTeamCoachRequest {
  userId: number;
  role: 'HEAD' | 'ASSISTANT';
}

export interface TeamCoach {
  id: number;
  userId: number;
  role: string;
  user?: {
    name: string;
    email: string;
  };
}
