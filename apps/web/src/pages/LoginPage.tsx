import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { academiesApi } from "../api/academies.api";
import { parseJwt } from "../hooks/useAuth";
import { useAuthStore } from "../store/auth.store";
import { strings } from "../lib/strings";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });

      if (data.requiresAcademySelection && data.tempToken) {
        localStorage.setItem("token", data.tempToken);
        navigate("/select-academy", {
          state: { memberships: data.memberships },
        });
        return;
      }

      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        const user = parseJwt(data.accessToken);
        let academy = null;
        if (user?.academyId) {
          try {
            const res = await academiesApi.getCurrent();
            academy = res.data;
          } catch {}
        }
        useAuthStore.getState().setSession(user, academy, data.accessToken);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? strings.auth.invalidCredentials);
    } finally {
      setLoading(false);
    }
  }

  const renderLoginForm = ({ compact = false }: { compact?: boolean }) => (
    <>
      {error && (
        <div
          className="mb-4 p-3 rounded-lg text-red-400 text-sm"
          style={{
            background: "rgba(185,41,2,0.15)",
            border: "1px solid rgba(185,41,2,0.3)",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-on-surface-variant text-xs tracking-widest uppercase mb-2">
            {strings.auth.emailOrUsername}
          </label>
          <div className="relative">
            {!compact && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-surface-low text-white text-sm py-3.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline-variant ${compact ? "px-4" : "pl-10 pr-4"}`}
              placeholder={strings.auth.emailUserPlaceholder}
              // autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-on-surface-variant text-xs tracking-widest uppercase">
              {strings.auth.passwordLabel}
            </label>
            <button
              type="button"
              className="text-primary text-xs tracking-wider hover:opacity-80 transition-opacity"
            >
              {strings.auth.forgotPassword}
            </button>
          </div>
          <div className="relative">
            {!compact && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </span>
            )}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-surface-low text-white text-sm py-3.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-outline-variant ${compact ? "px-4" : "pl-10 pr-4"}`}
              placeholder={strings.auth.passwordPlaceholder}
              autoComplete="current-password"
            />
          </div>
        </div>

        {/* Remember me (desktop only) */}
        {!compact && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
              style={{ background: "#0e0e0e", borderColor: "#494847" }}
            />
            <span className="text-on-surface-variant text-xs">
              {strings.auth.keepMeLoggedIn}
            </span>
          </label>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-lg font-bold text-sm tracking-widest uppercase text-[#0e0e0e] disabled:opacity-50 transition-opacity"
          style={{ background: "linear-gradient(135deg, #bcf521, #00f4fe)" }}
        >
          {loading ? strings.auth.loggingIn : strings.auth.loginArrow}
        </button>
      </form>
    </>
  );

  return (
    <div
      className="min-h-screen bg-[#0e0e0e]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on lg+)
      ═══════════════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Hero section */}
        <div className="relative flex flex-col" style={{ minHeight: "45vh" }}>
          {/* Athlete background gradient (replace background-image with an <img> if you have an asset) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #1c2a12 0%, #141414 40%, #0e0e0e 100%)",
            }}
          />
          {/* Subtle lime glow at top */}
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 0%, rgba(188,245,33,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Logo */}
          <div className="relative z-10 px-6 pt-8 flex items-center gap-2">
            <span className="text-primary text-lg leading-none">⚡</span>
            <span
              className="text-primary font-bold text-sm tracking-[0.18em] uppercase"
              style={{ fontFamily: "'Lexend', sans-serif" }}
            >
              {strings.brand.name}
            </span>
          </div>

          {/* Hero text */}
          <div className="relative z-10 px-6 pt-10 pb-8">
            <h1
              className="leading-none"
              style={{ fontFamily: "'Lexend', sans-serif" }}
            >
              <span
                className="block text-white font-bold"
                style={{
                  fontSize: "clamp(2.8rem, 12vw, 4rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                {strings.auth.heroLine1}
              </span>
              <span
                className="block text-primary font-bold"
                style={{
                  fontSize: "clamp(2.8rem, 12vw, 4rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                {strings.auth.heroLine2}
              </span>
            </h1>
            <p className="text-on-surface-variant text-xs tracking-[0.15em] uppercase mt-4">
              {strings.auth.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Form section */}
        <div className="flex-1 px-6 pt-2 pb-4">
          {renderLoginForm({ compact: true })}

          {/* New to academy */}
          <p className="text-center mt-6 text-on-surface-variant text-xs">
            {strings.auth.newToAcademy}{" "}
            <a
              href="/accept-invitation"
              className="text-primary font-semibold hover:opacity-80 transition-opacity"
            >
              {strings.auth.requestAccess}
            </a>
          </p>

          {/* Quick Access */}
        </div>

        {/* Mobile footer */}
        {/* <div className="px-6 pb-6 pt-2 text-center">
          <div className="flex justify-center gap-5 mb-2">
            <button
              type="button"
              className="text-outline-variant text-xs tracking-wider hover:text-on-surface-variant transition-colors"
            >
              {strings.auth.footerPrivacy}
            </button>
            <button
              type="button"
              className="text-outline-variant text-xs tracking-wider hover:text-on-surface-variant transition-colors"
            >
              {strings.auth.footerTerms}
            </button>
            <button
              type="button"
              className="text-outline-variant text-xs tracking-wider hover:text-on-surface-variant transition-colors"
            >
              {strings.auth.footerSupport}
            </button>
          </div>
          <p className="text-outline-variant text-xs">
            {strings.auth.footerCopyright}
          </p>
        </div> */}
      </div>

      {/* ═══════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden below lg)
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col min-h-screen">
        {/* Top nav */}
        <nav
          className="flex items-center justify-between px-10 py-5 z-20 relative"
          style={{
            background: "rgba(32,31,31,0.7)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-primary text-lg leading-none">⚡</span>
            <span
              className="text-primary font-bold text-sm tracking-[0.18em] uppercase"
              style={{ fontFamily: "'Lexend', sans-serif" }}
            >
              {strings.brand.name}
            </span>
          </div>
          <div className="flex items-center gap-8">
            <button
              type="button"
              className="text-on-surface-variant text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              {strings.auth.navPrograms}
            </button>
            <button
              type="button"
              className="text-on-surface-variant text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              {strings.auth.navMethodology}
            </button>
            <button
              type="button"
              className="text-on-surface-variant text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              {strings.auth.navAthletes}
            </button>
            <a
              href="/accept-invitation"
              className="px-5 py-2 rounded-lg text-xs font-bold tracking-widest uppercase text-[#0e0e0e] hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #bcf521, #00f4fe)",
              }}
            >
              {strings.auth.requestAccess}
            </a>
          </div>
        </nav>

        {/* Main split */}
        <div className="flex flex-1">
          {/* Left: Hero panel */}
          <div className="flex-1 relative flex flex-col justify-end p-14 overflow-hidden">
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, #1c2a12 0%, #141414 45%, #0e0e0e 100%)",
              }}
            />
            {/* Lime glow */}
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 10%, rgba(188,245,33,0.06) 0%, transparent 60%)",
              }}
            />
            {/* Right fade to panel */}
            <div
              className="absolute top-0 right-0 bottom-0 w-40 pointer-events-none"
              style={{
                background: "linear-gradient(to right, transparent, #0e0e0e)",
              }}
            />

            {/* Hero text */}
            <div className="relative z-10">
              <p className="text-primary text-xs tracking-[0.25em] uppercase mb-5">
                {strings.auth.heroTagline}
              </p>
              <h1
                className="font-bold leading-none"
                style={{ fontFamily: "'Lexend', sans-serif" }}
              >
                <span
                  className="block text-white"
                  style={{
                    fontSize: "clamp(3rem, 5.5vw, 5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {strings.auth.desktopHeroLine1}
                </span>
                <span
                  className="block text-white"
                  style={{
                    fontSize: "clamp(3rem, 5.5vw, 5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {strings.auth.desktopHeroLine2}
                </span>
                <span
                  className="block text-white"
                  style={{
                    fontSize: "clamp(3rem, 5.5vw, 5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {strings.auth.desktopHeroLine3}
                </span>
              </h1>
              <div
                className="mt-5 h-1 w-16 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #bcf521, #00f4fe)",
                }}
              />
            </div>
          </div>

          {/* Right: Form panel */}
          <div
            className="w-full max-w-105 flex flex-col justify-center px-10 py-12"
            style={{ background: "#131313" }}
          >
            <h2
              className="text-white text-2xl font-bold mb-1"
              style={{ fontFamily: "'Lexend', sans-serif" }}
            >
              {strings.auth.welcomeBack}
            </h2>
            <p className="text-on-surface-variant text-sm mb-8">
              {strings.auth.enterCredentials}
            </p>

            {renderLoginForm({})}

            {/* New to academy */}
            <p className="text-center mt-6 text-on-surface-variant text-xs">
              {strings.auth.newToAcademy}{" "}
              <a
                href="/accept-invitation"
                className="text-primary font-semibold hover:opacity-80 transition-opacity"
              >
                {strings.auth.requestAccess}
              </a>
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ background: "#201f1f" }}>
                <p
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: "'Lexend', sans-serif" }}
                >
                  {strings.auth.statsAthletesCount}
                </p>
                <p className="text-on-surface-variant text-xs tracking-widest uppercase mt-1">
                  {strings.auth.statsAthletes}
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "#201f1f" }}>
                <p
                  className="text-primary text-xl font-bold"
                  style={{ fontFamily: "'Lexend', sans-serif" }}
                >
                  {strings.auth.statsSuccessRateValue}
                </p>
                <p className="text-on-surface-variant text-xs tracking-widest uppercase mt-1">
                  {strings.auth.statsSuccessRate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop footer */}
        <div
          className="flex items-center justify-between px-10 py-4"
          style={{ background: "#0e0e0e" }}
        >
          <p className="text-outline-variant text-xs">
            {strings.auth.footerCopyright}
          </p>
          <div className="flex gap-6">
            <button
              type="button"
              className="text-outline-variant text-xs tracking-wider hover:text-on-surface-variant transition-colors"
            >
              {strings.auth.footerPrivacy}
            </button>
            <button
              type="button"
              className="text-outline-variant text-xs tracking-wider hover:text-on-surface-variant transition-colors"
            >
              {strings.auth.footerTerms}
            </button>
            <button
              type="button"
              className="text-outline-variant text-xs tracking-wider hover:text-on-surface-variant transition-colors"
            >
              {strings.auth.footerSupport}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
