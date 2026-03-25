import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface NavItem {
  label: string;
  to: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  {
    label: "Crear Academia",
    to: "/admin/academies/new",
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Crear Equipo",
    to: "/teams/new",
    roles: ["SUPER_ADMIN", "DIRECTOR", "COACH"],
  },
  { label: "Invitar Usuario", to: "/invite", roles: ["DIRECTOR"] },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const visible = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!user?.role) return false;
    return item.roles.some((r) => user.role!.includes(r));
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-gray-700">
          <span className="text-lg font-bold tracking-wide text-white">
            Cancha360
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visible.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2 truncate">
            {user?.role}
            {user?.academyId ? ` · #${user.academyId}` : ""}
          </p>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-sm text-gray-400">{location.pathname}</span>
          <span className="text-sm font-semibold text-gray-700 bg-indigo-50 px-3 py-1 rounded-full">
            {user?.role ?? "—"}
          </span>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
