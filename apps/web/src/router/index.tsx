import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import LoginPage from '../pages/LoginPage';
import SelectAcademyPage from '../pages/SelectAcademyPage';
import AcceptInvitationPage from '../pages/AcceptInvitationPage';
import DashboardPage from '../pages/DashboardPage';
import CreateAcademyPage from '../pages/CreateAcademyPage';
import CreateTeamPage from '../pages/CreateTeamPage';
import CreatePlayerPage from '../pages/CreatePlayerPage';
import PlayerProgressPage from '../pages/PlayerProgressPage';
import CreateEvaluationPage from '../pages/CreateEvaluationPage';
import CreateTrainingSchedulePage from '../pages/CreateTrainingSchedulePage';
import TrainingSessionPage from '../pages/TrainingSessionPage';
import TeamCoachesPage from '../pages/TeamCoachesPage';
import InvitePage from '../pages/InvitePage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/select-academy" element={<SelectAcademyPage />} />
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
          path="/players/:playerId/progress"
          element={
            <ProtectedRoute>
              <PlayerProgressPage />
            </ProtectedRoute>
          }
        />

        {/* Protected — DIRECTOR or COACH */}
        <Route
          path="/teams/new"
          element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'DIRECTOR', 'COACH']}>
              <CreateTeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId/players/new"
          element={
            <ProtectedRoute roles={['DIRECTOR', 'COACH']}>
              <CreatePlayerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId/coaches"
          element={
            <ProtectedRoute roles={['DIRECTOR', 'COACH']}>
              <TeamCoachesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams/:teamId/training-schedules/new"
          element={
            <ProtectedRoute roles={['DIRECTOR', 'COACH']}>
              <CreateTrainingSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training-sessions/:sessionId"
          element={
            <ProtectedRoute roles={['DIRECTOR', 'COACH']}>
              <TrainingSessionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players/:playerId/evaluations/new"
          element={
            <ProtectedRoute roles={['DIRECTOR', 'COACH']}>
              <CreateEvaluationPage />
            </ProtectedRoute>
          }
        />

        {/* Protected — DIRECTOR only */}
        <Route
          path="/invite"
          element={
            <ProtectedRoute roles={['DIRECTOR']}>
              <InvitePage />
            </ProtectedRoute>
          }
        />

        {/* Protected — SUPER_ADMIN only */}
        <Route
          path="/admin/academies/new"
          element={
            <ProtectedRoute roles={['SUPER_ADMIN']}>
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
