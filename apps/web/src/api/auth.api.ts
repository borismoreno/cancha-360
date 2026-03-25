import { http } from './http';
import type {
  LoginRequest,
  LoginResponse,
  SelectAcademyRequest,
  SelectAcademyResponse,
  AcceptInvitationRequest,
} from '../types/auth';

export const authApi = {
  login: (data: LoginRequest) =>
    http.post<LoginResponse>('/auth/login', data),

  selectAcademy: (data: SelectAcademyRequest) =>
    http.post<SelectAcademyResponse>('/auth/select-academy', data),

  acceptInvitation: (data: AcceptInvitationRequest) =>
    http.post('/auth/accept-invitation', data),
};
