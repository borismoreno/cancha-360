import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    api.get("/players").then((res) => {
      setPlayers(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Jugadores</h1>

      <div className="grid grid-cols-3 gap-4">
        {players.map((p: any) => (
          <div
            key={p.id}
            className="p-4 bg-white shadow cursor-pointer"
            onClick={() => (window.location.href = `/players/${p.id}`)}
          >
            <h2 className="font-bold">{p.name}</h2>
            <p>Edad: {p.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
