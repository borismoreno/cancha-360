export interface CreatePlayerRequest {
  name: string;
  birthdate: string;
  position?: string;
  parentName?: string;
  parentEmail?: string;
}

export interface Player {
  id: number;
  name: string;
  position?: string;
  birthdate: string;
  teamId: number;
  academyId: number;
}

export interface Evaluation {
  id: number;
  technicalScore: number;
  tacticalScore: number;
  physicalScore: number;
  attitudeScore: number;
  notes?: string;
  createdAt: string;
  date: string;
}

export interface PlayerProgress {
  player: {
    id: number;
    name: string;
    position?: string;
    birthdate?: string;
    team?: { id: number; name: string; category: string };
  };
  evaluations: Evaluation[];
  averages: {
    technical: number;
    tactical: number;
    physical: number;
    attitude: number;
  };
  attendanceSummary?: {
    totalSessions: number;
    attended: number;
    missed: number;
  };
}
