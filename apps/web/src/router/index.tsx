import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

import LoginPage from "../pages/LoginPage";
import SelectAcademyPage from "../pages/SelectAcademyPage";
import AcceptInvitationPage from "../pages/AcceptInvitationPage";
import DashboardPage from "../pages/DashboardPage";
import CreateAcademyPage from "../pages/CreateAcademyPage";
import TeamsPage from "../pages/TeamsPage";
import TeamDetailPage from "../pages/TeamDetailPage";
import CreateTeamPage from "../pages/CreateTeamPage";
import PlayersListPage from "../pages/PlayersListPage";
import CreatePlayerPage from "../pages/CreatePlayerPage";
import PlayerProgressPage from "../pages/PlayerProgressPage";
import CreateEvaluationPage from "../pages/CreateEvaluationPage";
import CreateTrainingSchedulePage from "../pages/CreateTrainingSchedulePage";
import SessionsListPage from "../pages/SessionsListPage";
import TrainingSessionPage from "../pages/TrainingSessionPage";
import TeamCoachesPage from "../pages/TeamCoachesPage";
import InvitePage from "../pages/InvitePage";
import PlayerDetailPage from "../pages/PlayerDetailPage";
import RequestAccessPage from "../pages/RequestAccessPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/select-academy"
          element={
            <PublicRoute>
              <SelectAcademyPage />
            </PublicRoute>
          }
        />
        <Route
          path="/request-access"
          element={
            <PublicRoute>
              <RequestAccessPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route path="/accept-invitation" element={<AcceptInvitationPage />} />

        {/* Protected — any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/:id"
          element={
            <ProtectedRoute>
              <PlayerDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/:playerId/progress"
          element={
            <ProtectedRoute>
              <PlayerProgressPage />
            </ProtectedRoute>
          }
        />

        {/* Teams browsing — DIRECTOR, COACH, SUPER_ADMIN */}
        <Route
          path="/teams"
          element={
            <ProtectedRoute roles={["SUPER_ADMIN", "DIRECTOR", "COACH"]}>
              <TeamsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId"
          element={
            <ProtectedRoute roles={["SUPER_ADMIN", "DIRECTOR", "COACH"]}>
              <TeamDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/new"
          element={
            <ProtectedRoute roles={["SUPER_ADMIN", "DIRECTOR", "COACH"]}>
              <CreateTeamPage />
            </ProtectedRoute>
          }
        />

        {/* Players */}
        <Route
          path="/teams/:teamId/players"
          element={
            <ProtectedRoute roles={["DIRECTOR", "COACH", "PARENT"]}>
              <PlayersListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId/players/new"
          element={
            <ProtectedRoute roles={["DIRECTOR", "COACH"]}>
              <CreatePlayerPage />
            </ProtectedRoute>
          }
        />

        {/* Coaches */}
        <Route
          path="/teams/:teamId/coaches"
          element={
            <ProtectedRoute roles={["DIRECTOR", "COACH"]}>
              <TeamCoachesPage />
            </ProtectedRoute>
          }
        />

        {/* Training */}
        <Route
          path="/teams/:teamId/training-schedules/new"
          element={
            <ProtectedRoute roles={["DIRECTOR", "COACH"]}>
              <CreateTrainingSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId/sessions"
          element={
            <ProtectedRoute roles={["DIRECTOR", "COACH"]}>
              <SessionsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training-sessions/:sessionId"
          element={
            <ProtectedRoute roles={["DIRECTOR", "COACH"]}>
              <TrainingSessionPage />
            </ProtectedRoute>
          }
        />

        {/* Evaluations */}
        <Route
          path="/players/:playerId/evaluations/new"
          element={
            <ProtectedRoute roles={["DIRECTOR", "COACH"]}>
              <CreateEvaluationPage />
            </ProtectedRoute>
          }
        />

        {/* Protected — DIRECTOR only */}
        <Route
          path="/invite"
          element={
            <ProtectedRoute roles={["DIRECTOR"]}>
              <InvitePage />
            </ProtectedRoute>
          }
        />

        {/* Protected — SUPER_ADMIN only */}
        <Route
          path="/admin/academies/new"
          element={
            <ProtectedRoute roles={["SUPER_ADMIN"]}>
              <CreateAcademyPage />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
