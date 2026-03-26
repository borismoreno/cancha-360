import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { teamsApi } from "../api/teams.api";
import { useAuth } from "../hooks/useAuth";

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", category: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const academyId = user?.academyId;
    if (!academyId) {
      setError("No se encontró la academia.");
      setLoading(false);
      return;
    }
    try {
      await teamsApi.create(academyId, form);
      setSuccess(true);
      setTimeout(() => navigate("/teams"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Error al crear equipo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/teams")}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm mb-4"
        >
          ← Mis Equipos
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Crear Equipo</h1>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            Equipo creado exitosamente. Redirigiendo...
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del equipo
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Tigres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Sub-15"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-5 rounded-md text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? "Creando..." : "Crear Equipo"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/teams")}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-md text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
