export interface CreateTeamRequest {
  name: string;
  category: string;
}

export interface Team {
  id: number;
  name: string;
  category: string;
  academyId: number;
}
