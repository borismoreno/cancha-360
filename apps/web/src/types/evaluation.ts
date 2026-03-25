export interface CreateEvaluationRequest {
  technicalScore: number;
  tacticalScore: number;
  physicalScore: number;
  attitudeScore: number;
  notes?: string;
}
