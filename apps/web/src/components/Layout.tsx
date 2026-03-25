import { useState } from "react";
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

function SidebarContent({
  visible,
  location,
  user,
  logout,
  onNavClick,
}: {
  visible: NavItem[];
  location: ReturnType<typeof useLocation>;
  user: ReturnType<typeof useAuth>["user"];
  logout: () => void;
  onNavClick?: () => void;
}) {
  return (
    <>
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
            onClick={onNavClick}
            className={`flex items-center px-3 py-3 rounded-md text-base md:text-sm font-medium transition-colors ${
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
          className="text-sm text-gray-400 hover:text-white transition-colors py-1"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visible = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!user?.role) return false;
    return item.roles.some((r) => user.role!.includes(r));
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: slide-in drawer on mobile, fixed on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col shrink-0 transition-transform duration-300 ease-in-out md:relative md:w-56 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          visible={visible}
          location={location}
          user={user}
          logout={logout}
          onNavClick={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 -ml-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="text-sm text-gray-400 truncate hidden sm:block">
              {location.pathname}
            </span>
          </div>
          <span className="text-xs md:text-sm font-semibold text-gray-700 bg-indigo-50 px-2 md:px-3 py-1 rounded-full shrink-0">
            {user?.role ?? "—"}
          </span>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
