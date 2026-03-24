import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    api.get(`/players/${id}/progress`).then((res) => {
      setPlayer(res.data);
    });
  }, [id]);

  if (!player) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">{player.player.name}</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow">
          Técnica: {player.averages.technical}
        </div>
        <div className="bg-white p-4 shadow">
          Táctica: {player.averages.tactical}
        </div>
        <div className="bg-white p-4 shadow">
          Físico: {player.averages.physical}
        </div>
        <div className="bg-white p-4 shadow">
          Actitud: {player.averages.attitude}
        </div>
      </div>
    </div>
  );
}
