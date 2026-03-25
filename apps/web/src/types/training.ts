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

export interface TrainingSession {
  id: number;
  teamId: number;
  academyId: number;
  date: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
  cancelReason?: string;
}
