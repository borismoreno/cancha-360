import { http } from './http';
import type { CreateInvitationRequest } from '../types/invitation';

export const invitationsApi = {
  create: (data: CreateInvitationRequest) =>
    http.post('/academies/invitations', data),
};
