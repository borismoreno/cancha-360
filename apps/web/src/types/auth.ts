export interface LoginRequest {
  email: string;
  password: string;
}

export interface AcademyMembership {
  academyId: number;
  academyName: string;
  role: string;
}

export interface LoginResponse {
  accessToken?: string;
  requiresAcademySelection?: boolean;
  tempToken?: string;
  memberships?: AcademyMembership[];
}

export interface SelectAcademyRequest {
  academyId: number;
}

export interface SelectAcademyResponse {
  accessToken: string;
}

export interface AcceptInvitationRequest {
  token: string;
  name: string;
  password: string;
}

export interface JwtUser {
  userId: number;
  academyId?: number;
  role?: string[];
  type?: string;
}
