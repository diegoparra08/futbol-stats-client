"use client";

import { useState, useEffect } from "react";
import { PlayerReadDTO } from "@/types";
import { playerService } from "@/services/playerService";
import Link from "next/link";
import PlayerCard from "@/components/playerCard";

interface PlayerListProps {
  initialPlayers: PlayerReadDTO[];
}

export default function PlayerList({ initialPlayers }: PlayerListProps) {
  const [players, setPlayers] = useState<PlayerReadDTO[]>(initialPlayers);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNewData = async () => {
      setLoading(true);
      try {
        const playerList = await playerService.getAllPlayers(includeInactive);
        setPlayers(playerList);
      } catch (error) {
        console.error("Error cargando jugadores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewData();
  }, [includeInactive]);

  const handleUpdateData = async () => {
    try {
      const updatedPlayerList =
        await playerService.getAllPlayers(includeInactive);
      setPlayers(updatedPlayerList);
    } catch (error) {
      console.error("Error al refrescar listado desde la tarjeta:", error);
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.nickname &&
        player.nickname.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPosition =
      positionFilter === "all" ||
      (player.positions && player.positions.includes(positionFilter));

    return matchesSearch && matchesPosition;
  });

  return (
    <div>
      {/* Barra de Herramientas */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-900 p-4 rounded-xl border border-slate-800 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">
            Buscar Jugador
          </label>
          <input
            type="text"
            placeholder="Ej. Cristiano Ronaldo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        <div className="w-full md:w-48">
          <label className="block text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">
            Posición
          </label>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all text-sm"
          >
            <option value="all">⚽ Todas</option>
            <option value="GK">Arquero (GK)</option>
            <option value="CB">Central (CB)</option>
            <option value="LB">Lateral Izq (LB)</option>
            <option value="RB">Lateral Der (RB)</option>
            <option value="CM">Mediocampista (CM)</option>
            <option value="CAM">Mediocampista Ofensivo (CAM)</option>
            <option value="RM">Medio Der (RM)</option>
            <option value="LM">Nedio Izq (LM)</option>
            <option value="RW">Extremo Der (RW)</option>
            <option value="LW">Extremo Izq (LW)</option>
            <option value="ST">Delantero (ST)</option>
            <option value="CF">Delantero (CF)</option>
          </select>
        </div>

        <div className="w-full md:w-auto flex items-center justify-end">
          <label className="inline-flex items-center cursor-pointer gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white peer-checked:after:border-white"></div>
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">
              {includeInactive ? "🚫 Viendo Retirados" : "🏃‍♂️ Solo Activos"}
            </span>
          </label>
        </div>

        <div className="w-full md:w-auto flex items-center justify-end">
          <Link
            href="/players/new"
            className="inline-flex items-center text-sm uppercase cursor-pointer gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium  hover:text-slate-300"
          >
            ➕ Nuevo Jugador
          </Link>
        </div>
      </div>

      {/* Indicador de Carga */}
      {loading ? (
        <div className="p-8 text-center text-emerald-400 font-medium animate-pulse">
          Consultando base de datos...
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-slate-500">
          No se encontraron jugadores.
        </div>
      ) : (
        /* Lista de Jugadores limpia */
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onPlayerUpdated={handleUpdateData}
            />
          ))}
        </div>
      )}
    </div>
  );
}
