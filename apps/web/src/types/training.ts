export interface CreateTrainingScheduleRequest {
  daysOfWeek: string[];
  time: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export interface AttendanceRequest {
  playerId: number;
  status: 'PRESENT' | 'ABSENT';
}

export interface CancelSessionRequest {
  reason?: string;
}
