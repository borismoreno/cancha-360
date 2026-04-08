import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { trainingsApi } from "../api/trainings.api";
import { teamsApi } from "../api/teams.api";
import { strings } from "../lib/strings";

export default function CreateTrainingSchedulePage() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const queryClient = useQueryClient();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [form, setForm] = useState({
    time: "",
    startDate: "",
    endDate: "",
    location: "",
  });
  const [success, setSuccess] = useState(false);
  const [daysError, setDaysError] = useState("");

  const { data: team } = useQuery({
    queryKey: ['team', Number(teamId)],
    queryFn: () => teamsApi.getOne(Number(teamId)).then((r) => r.data),
    enabled: !!teamId,
  });

  const { mutate: createSchedule, isPending, error } = useMutation({
    mutationFn: () =>
      trainingsApi.createSchedule(Number(teamId), {
        daysOfWeek: selectedDays,
        time: form.time,
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', Number(teamId)] });
      setSuccess(true);
      setTimeout(() => navigate(`/teams/${teamId}/sessions`), 1500);
    },
  });

  const errorMsg = error ? ((error as any)?.response?.data?.message ?? strings.sessions.schedule.errorCreate) : daysError;

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedDays.length === 0) {
      setDaysError(strings.sessions.schedule.errorNoDays);
      return;
    }
    setDaysError("");
    createSchedule();
  }

  return (
    <Layout>
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(`/teams/${teamId}`)}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm mb-4"
        >
          ← {team ? team.name : strings.teams.teamFallback}
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          {strings.sessions.schedule.createTitle}
        </h1>
        {team && (
          <p className="text-sm text-gray-500 mb-6">
            {team.name} · {team.category}
          </p>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            {strings.sessions.schedule.successCreate}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {strings.sessions.schedule.daysLabel}
            </label>
            <div className="flex gap-2 flex-wrap">
              {strings.sessions.schedule.days.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors min-w-11 ${
                    selectedDays.includes(day.value)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.sessions.schedule.timeLabel}
            </label>
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.sessions.schedule.startDateLabel}
            </label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.sessions.schedule.endDateLabel}
            </label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {strings.sessions.schedule.locationLabel}
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={strings.sessions.schedule.locationPlaceholder}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {isPending ? strings.common.creating : strings.sessions.schedule.createButton}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-md text-sm transition-colors"
            >
              {strings.common.cancel}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
