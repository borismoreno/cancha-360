import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

interface ActionCard {
  title: string;
  description: string;
  to: string;
  roles: string[];
}

const actions: ActionCard[] = [
  {
    title: "Crear Academia",
    description: "Registrar una nueva academia deportiva en el sistema.",
    to: "/admin/academies/new",
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "Crear Equipo",
    description: "Agregar un nuevo equipo a la academia.",
    to: "/teams/new",
    roles: ["SUPER_ADMIN", "DIRECTOR", "COACH"],
  },
  {
    title: "Invitar Usuario",
    description: "Enviar invitación a un entrenador o padre.",
    to: "/invite",
    roles: ["DIRECTOR"],
  },
];

const teamActions = [
  { label: "Agregar Jugador", path: "/teams/:teamId/players/new" },
  {
    label: "Horario de Entrenamiento",
    path: "/teams/:teamId/training-schedules/new",
  },
  { label: "Entrenadores del Equipo", path: "/teams/:teamId/coaches" },
  { label: "Sesión de Entrenamiento", path: "/training-sessions/:sessionId" },
  { label: "Evaluar Jugador", path: "/players/:playerId/evaluations/new" },
  { label: "Progreso del Jugador", path: "/players/:playerId/progress" },
];

export default function DashboardPage() {
  const { user, isDirector, isCoach } = useAuth();
  const navigate = useNavigate();

  const visible = actions.filter(
    (a) => user?.role && a.roles.some((r) => user.role!.includes(r)),
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bienvenido. Rol:{" "}
          <span className="font-semibold text-gray-700">{user?.role}</span>
          {user?.academyId && (
            <span className="ml-2 text-gray-400">
              · Academia #{user.academyId}
            </span>
          )}
        </p>
      </div>

      {visible.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Acciones rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((action) => (
              <button
                key={action.to}
                onClick={() => navigate(action.to)}
                className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-sm transition-all group"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {(isCoach || isDirector) && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Operaciones por equipo / jugador
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teamActions.map((a) => (
              <div
                key={a.path}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <p className="font-medium text-gray-700 text-sm">{a.label}</p>
                <p className="text-xs text-gray-400 font-mono mt-1 break-all">{a.path}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {visible.length === 0 && !isCoach && !isDirector && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No hay acciones disponibles para tu rol.</p>
        </div>
      )}
    </Layout>
  );
}
