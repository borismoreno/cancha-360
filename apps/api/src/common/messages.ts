export const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    NO_MEMBERSHIPS: 'No se encontraron membresías activas',
    NO_MEMBERSHIP_FOR_ACADEMY: 'No tienes una membresía activa en esta academia',
    INSUFFICIENT_ROLE: 'No tienes permisos para realizar esta acción',
  },
  INVITATION: {
    NOT_FOUND: 'Invitación no encontrada',
    NOT_PENDING: 'La invitación no está pendiente',
    EXPIRED: 'La invitación ha expirado',
    ALREADY_MEMBER: 'El usuario ya tiene una membresía en esta academia',
    ALREADY_EXISTS:
      'Ya existe una invitación pendiente para este correo en esta academia',
    NOT_DIRECTOR: 'El usuario no es DIRECTOR de esta academia',
  },
  ACADEMY: {
    NOT_FOUND: (id: number) => `Academia ${id} no encontrada`,
  },
  TEAM: {
    NOT_FOUND: (id: number) => `Equipo ${id} no encontrado en tu academia`,
    COACH_NOT_MEMBER: 'El entrenador no tiene una membresía en esta academia',
    COACH_INVALID_ROLE: 'El usuario especificado no es ENTRENADOR en esta academia',
  },
  PLAYER: {
    NOT_FOUND: (id: number) => `Jugador ${id} no encontrado en tu academia`,
    PARENT_NAME_REQUIRED:
      'El nombre del padre/madre es obligatorio al crear un nuevo usuario padre',
    NOT_LINKED: 'No estás vinculado a este jugador',
  },
  TEAM_COACH: {
    USER_NOT_FOUND: (id: number) => `Usuario ${id} no encontrado`,
    ALREADY_ASSIGNED: 'El entrenador ya está asignado a este equipo',
    NOT_FOUND: 'El entrenador no está asignado a este equipo',
    FORBIDDEN: 'No eres entrenador de este equipo',
  },
  TRAINING: {
    TEAM_NOT_FOUND: (id: number) => `Equipo ${id} no encontrado en tu academia`,
    INVALID_DATE_RANGE: 'La fecha de inicio debe ser anterior a la fecha de fin',
    SESSION_NOT_FOUND: (id: number) =>
      `Sesión de entrenamiento ${id} no encontrada en tu academia`,
  },
};
