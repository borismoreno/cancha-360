/**
 * strings.ts
 *
 * Single source of truth for all UI text in the application.
 * Organised by domain/feature. To change any label, message, or
 * placeholder shown to users, edit only this file.
 *
 * Dynamic strings (those that embed runtime values) are plain
 * arrow functions so TypeScript checks the arguments.
 *
 * Usage:
 *   import { strings } from '../lib/strings';
 *   <button>{strings.common.cancel}</button>
 *   <p>{strings.players.playerCount(5)}</p>
 */

export const strings = {
  // ─── Brand ────────────────────────────────────────────────────────────────

  brand: {
    name: "Cancha360",
    tagline: "ELITE ACADEMY",
    academyFallback: "Academia",
    searchPlaceholder: "Buscar jugadores, ejercicios o equipos...",
  },

  // ─── Common ───────────────────────────────────────────────────────────────

  common: {
    loading: "Cargando...",
    saving: "Guardando...",
    creating: "Creando...",
    sending: "Enviando...",
    cancel: "Cancelar",
    back: "← Volver",
    scoreSuffix: "/10",
  },

  // ─── Roles ────────────────────────────────────────────────────────────────

  roles: {
    SUPER_ADMIN: "Super Admin",
    DIRECTOR: "Academy Director",
    COACH: "Coach",
    PARENT: "Padre / Tutor",
    /** Short form used in greetings */
    greetingName: {
      SUPER_ADMIN: "Admin",
      DIRECTOR: "Director",
      COACH: "Coach",
      PARENT: "",
    } as Record<string, string>,
  },

  // ─── Navigation ───────────────────────────────────────────────────────────

  nav: {
    home: "Inicio",
    teams: "Equipos",
    players: "Jugadores",
    settings: "Configuración",
    logout: "Cerrar sesión",
    newSession: "NUEVA SESIÓN",
  },

  // ─── Auth ─────────────────────────────────────────────────────────────────

  auth: {
    loginTitle: "Cancha360",
    loginSubtitle: "Inicia sesión en tu cuenta",
    emailLabel: "Email",
    emailPlaceholder: "correo@ejemplo.com",
    passwordLabel: "CONTRASEÑA",
    passwordPlaceholder: "••••••••",
    loggingIn: "Ingresando...",
    loginButton: "Ingresar",
    invitationPrompt: "¿Tienes una invitación?",
    activateLink: "Activar cuenta",
    invalidCredentials: "Credenciales inválidas",

    // Login page redesign strings
    heroLine1: "PODER",
    heroLine2: "ASEGURADO.",
    heroSubtitle: "PORTAL DE ACADEMIA / ACCESO DE ALTO RENDIMIENTO",
    heroTagline: "THE KINETIC EDGE",
    desktopHeroLine1: "ALTO",
    desktopHeroLine2: "RENDIMIENTO",
    desktopHeroLine3: "COMIENZA AQUÍ.",
    emailOrUsername: "EMAIL O USUARIO",
    emailUserPlaceholder: "atleta@cancha360.com",
    forgotPassword: "¿OLVIDÉ MI CONTRASEÑA?",
    loginArrow: "INGRESAR →",
    newToAcademy: "¿Nuevo en la Academia?",
    requestAccess: "Solicitar Acceso",
    quickAccess: "ACCESO RÁPIDO",
    welcomeBack: "Bienvenido de nuevo",
    enterCredentials: "Ingresa tus credenciales para acceder a la unidad.",
    keepMeLoggedIn: "Mantenerme conectado en la unidad segura",
    navPrograms: "PROGRAMAS",
    navMethodology: "METODOLOGÍA",
    navAthletes: "ATLETAS",
    statsAthletesCount: "2,480+",
    statsAthletes: "ATLETAS",
    statsSuccessRateValue: "94.2%",
    statsSuccessRate: "TASA DE ÉXITO",
    footerPrivacy: "POLÍTICA DE PRIVACIDAD",
    footerTerms: "TÉRMINOS DE SERVICIO",
    footerSupport: "SOPORTE",
    footerCopyright: "© 2024 CANCHA360 ELITE ACADEMY. ACCESO DE ALTO RENDIMIENTO ASEGURADO",

    activateTitle: "Activar cuenta",
    activateSubtitle: "Completa tu registro con la invitación recibida.",
    activatedSuccess: "Cuenta activada. Redirigiendo al login...",
    noToken: "Token de invitación no encontrado en la URL.",
    tokenLabel: "Token",
    fullNameLabel: "Nombre completo",
    fullNamePlaceholder: "Tu nombre completo",
    passwordMinHint: "Mínimo 8 caracteres",
    activating: "Activando...",
    activateButton: "Activar cuenta",
    errorActivate: "Error al activar cuenta",
  },

  // ─── Academies ────────────────────────────────────────────────────────────

  academies: {
    selectTitle: "Selecciona una academia",
    selectDescription: "Tienes acceso a múltiples academias.",
    noAcademies: "No hay academias disponibles.",
    errorSelect: "Error al seleccionar academia",

    createTitle: "Crear Academia",
    nameLabel: "Nombre de la academia",
    countryLabel: "País",
    cityLabel: "Ciudad",
    directorNameLabel: "Nombre del director",
    directorEmailLabel: "Correo del director",
    createButton: "Crear Academia",
    successCreate: "Academia creada exitosamente. Redirigiendo...",
    errorCreate: "Error al crear academia",
  },

  // ─── Dashboard ────────────────────────────────────────────────────────────

  dashboard: {
    greeting: {
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches",
      academy: "Así va tu academia hoy",
    },

    metrics: {
      activeTeams: "EQUIPOS ACTIVOS",
      activeTeamsSub: (n: number) => `${n} activos`,
      totalPlayers: "JUGADORES TOTALES",
      totalPlayersSub: (n: number) => `Estado Elite: ${n}`,
      evaluations: "EVALUACIONES",
      evaluationsSub: (n: number) => `Pendientes: ${n}`,
    },

    cta: {
      title: "Ver cómo están mejorando tus jugadores",
      subtitle:
        "Accede al panel de rendimiento avanzado y analiza la evolución táctica de cada atleta.",
      button: "Ver rendimiento",
    },

    activity: {
      heading: "Actividad Reciente",
      viewHistory: "VER HISTORIAL",
      noEvaluations: "Sin evaluaciones aún",
      recentlyEvaluated: "Evaluado recientemente",
      noChanges: "Sin cambios recientes",
      emptyTitle: "Aún no has registrado evaluaciones.",
      emptyDescription:
        "Empieza a evaluar a tus jugadores para ver su progreso aquí.",
      goToTeams: "Ir a mis equipos →",
      viewAllPlayers: (n: number) => `Ver los ${n} jugadores →`,
    },

    teams: {
      heading: "Mis equipos",
    },

    actions: {
      createTeam: "Crear equipo",
      inviteUser: "Invitar usuario",
      createAcademy: "Crear Academia",
    },

    momentum: {
      label: "Momentum de evaluación",
      description: (pct: number) =>
        `Evaluaciones completadas un ${pct}% más activos esta semana.`,
    },

    parent: {
      welcome:
        "Bienvenido. Tu entrenador compartirá el progreso de tu jugador aquí.",
    },
  },

  // ─── Score labels (used in evaluation signals and forms) ──────────────────

  scoreLabels: {
    technicalScore: "Técnica individual",
    tacticalScore: "Táctica en campo",
    physicalScore: "Nivel de resistencia",
    attitudeScore: "Actitud en campo",
  },

  // ─── Teams ────────────────────────────────────────────────────────────────

  teams: {
    heading: "Mis Equipos",
    newButton: "+ Nuevo Equipo",
    errorLoading: "Error al cargar equipos",
    empty: "No hay equipos registrados.",
    createFirst: "Crear el primer equipo",
    backToTeams: "← Equipos",
    teamFallback: "Equipo",

    createTitle: "Crear Equipo",
    nameLabel: "Nombre del equipo",
    namePlaceholder: "Ej: Tigres",
    categoryLabel: "Categoría",
    categoryPlaceholder: "Ej: Sub-15",
    createButton: "Crear Equipo",
    successCreate: "Equipo creado exitosamente. Redirigiendo...",
    errorCreate: "Error al crear equipo",
    errorNoAcademy: "No se encontró la academia.",
    backToMyTeams: "← Mis Equipos",

    detail: {
      players: "Jugadores",
      playersDescription: "Ver y agregar jugadores del equipo.",
      coaches: "Entrenadores",
      coachesDescription: "Gestionar entrenadores asignados.",
      sessions: "Sesiones de Entrenamiento",
      sessionsDescription: "Ver sesiones y registrar asistencia.",
      newSchedule: "Nuevo Horario",
      newScheduleDescription: "Crear un horario de entrenamiento.",
    },

    playerCount: (n: number) => `${n} ${n === 1 ? "Jugador" : "Jugadores"}`,
  },

  // ─── Players ──────────────────────────────────────────────────────────────

  players: {
    heading: "Jugadores",
    addButton: "+ Agregar Jugador",
    errorLoading: "Error al cargar jugadores",
    empty: "No hay jugadores registrados.",
    addFirst: "Agregar el primer jugador",
    noPosition: "Sin posición definida",
    progressButton: "Progreso",
    evaluateButton: "Evaluar",
    playersFallback: "Jugadores",

    createTitle: "Agregar Jugador",
    nameLabel: "Nombre *",
    namePlaceholder: "Nombre completo del jugador",
    birthdateLabel: "Fecha de nacimiento *",
    positionLabel: "Posición (opcional)",
    positionPlaceholder: "Ej: Delantero, Portero...",
    guardianSection: "Datos del padre / madre (opcional)",
    guardianNameLabel: "Nombre",
    guardianEmailLabel: "Correo",
    addPlayerButton: "Agregar Jugador",
    successCreate: "Jugador agregado exitosamente. Redirigiendo...",
    errorCreate: "Error al crear jugador",

    progress: {
      defaultTitle: "Progreso del Jugador",
      newEvaluation: "Nueva evaluación",
      errorLoading: "Error al cargar progreso",
      technicalLabel: "Técnico",
      tacticalLabel: "Táctico",
      physicalLabel: "Físico",
      attitudeLabel: "Actitud",
      sessionsLabel: "Sesiones",
      attendedLabel: "Asistió",
      missedLabel: "Faltó",
      historyHeading: "Historial de evaluaciones",
      noEvaluations: "Sin evaluaciones registradas.",
    },
  },

  // ─── Evaluations ──────────────────────────────────────────────────────────

  evaluations: {
    createTitle: "Nueva Evaluación",
    technicalLabel: "Puntaje Técnico",
    tacticalLabel: "Puntaje Táctico",
    physicalLabel: "Puntaje Físico",
    attitudeLabel: "Puntaje de Actitud",
    notesLabel: "Notas (opcional)",
    notesPlaceholder: "Observaciones del entrenador...",
    saveButton: "Guardar Evaluación",
    successSave: "Evaluación guardada. Redirigiendo al progreso...",
    errorSave: "Error al registrar evaluación",
  },

  // ─── Sessions ─────────────────────────────────────────────────────────────

  sessions: {
    heading: "Sesiones de Entrenamiento",
    newScheduleButton: "+ Nuevo Horario",
    errorLoading: "Error al cargar sesiones",
    empty: "No hay sesiones programadas.",
    createScheduleLink: "Crear un horario de entrenamiento",
    manageButton: "Gestionar",

    status: {
      SCHEDULED: "Programada",
      CANCELLED: "Cancelada",
      COMPLETED: "Completada",
    } as Record<string, string>,

    detail: {
      title: "Sesión de Entrenamiento",
      errorLoading: "Error al cargar sesión",
      attendanceHeading: (count: number) => `Asistencia — ${count} jugadores`,
      noPlayers: "No hay jugadores en este equipo.",
      presentButton: "Presente",
      absentButton: "Ausente",
      cancelSection: "Cancelar Sesión",
      cancelReasonLabel: "Motivo (opcional)",
      cancelReasonPlaceholder: "Ej: Lluvia, cancha ocupada...",
      cancelling: "Cancelando...",
      cancelButton: "Cancelar Sesión",
      cancelledMessage: "Esta sesión fue cancelada.",
      errorCancel: "Error al cancelar sesión",
      sessionsFallback: "Sesiones",
    },

    schedule: {
      createTitle: "Nuevo Horario de Entrenamiento",
      daysLabel: "Días de la semana *",
      days: [
        { label: "Lun", value: "MON" },
        { label: "Mar", value: "TUE" },
        { label: "Mié", value: "WED" },
        { label: "Jue", value: "THU" },
        { label: "Vie", value: "FRI" },
        { label: "Sáb", value: "SAT" },
        { label: "Dom", value: "SUN" },
      ],
      timeLabel: "Hora *",
      startDateLabel: "Fecha de inicio *",
      endDateLabel: "Fecha de fin *",
      locationLabel: "Ubicación (opcional)",
      locationPlaceholder: "Ej: Campo norte",
      createButton: "Crear Horario",
      successCreate: "Horario creado exitosamente. Redirigiendo...",
      errorCreate: "Error al crear horario",
      errorNoDays: "Selecciona al menos un día de la semana",
    },
  },

  // ─── Coaches ──────────────────────────────────────────────────────────────

  coaches: {
    heading: "Entrenadores del Equipo",
    currentSection: "Entrenadores actuales",
    empty: "No hay entrenadores asignados.",
    coachFallback: "Entrenador",
    addSection: "Agregar Entrenador",
    roleLabels: {
      HEAD: "Entrenador Principal",
      ASSISTANT: "Asistente",
    } as Record<string, string>,
    removeButton: "Quitar",
    noAvailable: "No hay entrenadores disponibles para agregar.",
    selectLabel: "Seleccionar Entrenador",
    selectPlaceholder: "— Seleccionar entrenador —",
    roleLabel: "Rol",
    adding: "Agregando...",
    addButton: "Agregar",
    removeConfirm: "¿Eliminar este entrenador del equipo?",
    errorRemove: "Error al eliminar",
    errorAdd: "Error al agregar entrenador",
    errorLoad: "Error al cargar entrenadores",
  },

  // ─── Invitations ──────────────────────────────────────────────────────────

  invitations: {
    heading: "Invitar Usuario",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "correo@ejemplo.com",
    roleLabel: "Rol",
    sendButton: "Enviar Invitación",
    successSend:
      "Invitación enviada exitosamente. El usuario recibirá un correo con instrucciones.",
    errorSend: "Error al enviar invitación",
  },
} as const;
