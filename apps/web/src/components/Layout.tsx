import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/auth.store";
import { strings } from "../lib/strings";

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill={active ? "#bcf521" : "#adaaaa"}
    >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function TeamsIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill={active ? "#bcf521" : "#adaaaa"}
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function PlayersIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill={active ? "#bcf521" : "#adaaaa"}
    >
      <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill={active ? "#bcf521" : "#adaaaa"}
    >
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const ROLE_LABEL = strings.roles as unknown as Record<string, string>;

interface NavEntry {
  label: string;
  to: string;
  icon: (active: boolean) => React.ReactNode;
  matchFn: (path: string) => boolean;
  roles?: string[];
}

const NAV_ITEMS: NavEntry[] = [
  {
    label: strings.nav.home,
    to: "/dashboard",
    icon: (a) => <HomeIcon active={a} />,
    matchFn: (p) => p === "/dashboard",
  },
  {
    label: strings.nav.teams,
    to: "/teams",
    icon: (a) => <TeamsIcon active={a} />,
    matchFn: (p) => p.startsWith("/teams"),
    roles: ["SUPER_ADMIN", "DIRECTOR", "COACH"],
  },
  {
    label: strings.nav.players,
    to: "/teams",
    icon: (a) => <PlayersIcon active={a} />,
    matchFn: (p) => p.startsWith("/players"),
    roles: ["SUPER_ADMIN", "DIRECTOR", "COACH"],
  },
  {
    label: strings.nav.settings,
    to: "/dashboard",
    icon: (a) => <SettingsIcon active={a} />,
    matchFn: () => false,
  },
];

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const academy = useAuthStore((state) => state.academy);
  const academyName = academy?.name ?? null;

  const primaryRole = Array.isArray(user?.role) ? user?.role[0] : user?.role;
  const roleLabel = primaryRole
    ? (ROLE_LABEL[primaryRole] ?? primaryRole)
    : "—";
  const academyInitial = (academyName || "C")[0].toUpperCase();

  const visibleNav = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    if (!user?.role) return false;
    return item.roles.some((r) => user.role!.includes(r));
  });

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-52 bg-surface-low shrink-0">
        {/* Logo */}
        <div className="px-6 py-6 shrink-0">
          <p className="font-display font-bold text-white tracking-wider text-xl leading-none">
            {(academyName || "CANCHA360").toUpperCase()}
          </p>
          {/* <p
            className="font-body uppercase text-on-surface-variant mt-1"
            style={{ fontSize: "0.6rem", letterSpacing: "0.12em" }}
          >
            {strings.brand.tagline}
          </p> */}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {visibleNav.map((item) => {
            const active = item.matchFn(location.pathname);
            return (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors group"
                style={{ color: active ? "#ffffff" : "#adaaaa" }}
              >
                {/* Active bar */}
                <div
                  className="w-0.5 h-5 rounded-full shrink-0 transition-colors"
                  style={{
                    backgroundColor: active ? "#bcf521" : "transparent",
                  }}
                />
                {item.icon(active)}
                <span className="font-body text-sm font-medium group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* NEW SESSION button */}
        {/* <div className="p-4 shrink-0">
          <button
            onClick={() => navigate("/teams")}
            className="w-full flex items-center justify-center gap-2 rounded-full py-3 font-display font-semibold text-sm text-on-primary hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #bcf521 0%, #00f4fe 100%)" }}
          >
            <PlusIcon />
            {strings.nav.newSession}
          </button>
        </div> */}

        {/* Logout */}
        <div className="px-6 pb-4 shrink-0">
          <button
            onClick={logout}
            className="font-body text-xs text-on-surface-variant hover:text-white transition-colors"
          >
            {strings.nav.logout}
          </button>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Desktop header */}
        <header
          className="hidden md:flex items-center gap-4 px-6 py-3 shrink-0"
          style={{
            backgroundColor: "rgba(32,31,31,0.75)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Search */}
          {/* <div className="flex-1 max-w-sm">
            <div className="flex items-center gap-2 bg-surface-highest rounded-full px-4 py-2">
              <span className="text-on-surface-variant">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder={strings.brand.searchPlaceholder}
                className="bg-transparent font-body text-sm text-on-surface-variant placeholder-on-surface-variant/50 outline-none w-full"
              />
            </div>
          </div> */}

          {/* Right: bell + user */}
          <div className="flex items-center gap-4 ml-auto shrink-0">
            <button className="text-on-surface-variant hover:text-white transition-colors">
              <BellIcon />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className="font-body uppercase text-on-surface-variant"
                  style={{ fontSize: "0.6875rem", letterSpacing: "0.05em" }}
                >
                  {roleLabel}
                </p>
                <p className="font-display text-sm font-semibold text-white leading-tight">
                  {academyName ?? strings.brand.academyFallback}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #bcf521, #00f4fe)",
                }}
              >
                <span className="font-display text-xs font-bold text-on-primary">
                  {academyInitial}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile header */}
        <header className="flex md:hidden items-center justify-between px-4 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #bcf521, #00f4fe)",
              }}
            >
              <span className="font-display font-bold text-on-primary">
                {academyInitial}
              </span>
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm leading-tight">
                {academyName ?? "Cancha360"}
              </p>
              <p
                className="font-body uppercase text-primary"
                style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}
              >
                {roleLabel}
              </p>
            </div>
          </div>
          <button className="text-on-surface-variant hover:text-white transition-colors">
            <BellIcon />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2"
        style={{ backgroundColor: "#131313" }}
      >
        {visibleNav.slice(0, 4).map((item) => {
          const active = item.matchFn(location.pathname);
          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              {item.icon(active)}
              <span
                className="font-body font-medium"
                style={{
                  fontSize: "0.625rem",
                  color: active ? "#bcf521" : "#adaaaa",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
