"use client";

import { goalService } from "@/services/goalServices";
import { GoalReadDTO } from "@/types";
import GoalCard from "@/components/goalCard";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/services/api";

interface PlayerOption {
  id: number;
  name: string;
}

interface GoalListProps {
  initialGoals: GoalReadDTO[];
}

export default function GoalList({ initialGoals }: GoalListProps) {
  const [goals, setGoals] = useState<GoalReadDTO[]>(initialGoals);
  const [playersList, setPlayersList] = useState<PlayerOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  const [filterMatchId, setFilterMatchId] = useState<string>("");
  const [filterPlayerId, setFilterPlayerId] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");

  // Cargar la lista de jugadores para el select del filtro
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Player`);
        const data = await response.json();
        setPlayersList(data.data || data);
      } catch (error) {
        console.error("Error cargando jugadores para filtros:", error);
      }
    };
    fetchPlayers();
  }, []);

  //este se dispara cada vez que cambia un filtro
  useEffect(() => {
    const fetchFilteredGoals = async () => {
      setLoading(true);
      try {
        const matchIdParam = filterMatchId ? Number(filterMatchId) : undefined;
        const playerIdParam = filterPlayerId ? Number(filterPlayerId) : undefined;
        const yearParam = filterYear ? Number(filterYear) : undefined;

        //cargare los goles filtrados usando el servicio de goalService
        const filteredData = await goalService.getGoal(matchIdParam, playerIdParam, yearParam);
        setGoals(filteredData);
      } catch (error) {
        console.error("Error filtrando goles:", error);
      } finally {
        setLoading(false);
      }
    };

    // delay para no saturar la API si escriben rápido el ID
    const delayDebounce = setTimeout(() => {
      fetchFilteredGoals();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [filterMatchId, filterPlayerId, filterYear]);

  return (
    <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">Panel de Control</span>
          <h2 className="text-lg font-black uppercase text-slate-100 tracking-tight mt-0.5">
            Historial de Goles
          </h2>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/50">
        
        {/* Filtro: ID de Partido */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-mono font-bold uppercase">ID Partido</label>
          <input
            type="number"
            placeholder="Ej: 12"
            value={filterMatchId}
            onChange={(e) => setFilterMatchId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
          />
        </div>

        {/* Filtro: Jugador */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-mono font-bold uppercase">Autor del Gol</label>
          <select
            value={filterPlayerId}
            onChange={(e) => setFilterPlayerId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">-- Todos los jugadores --</option>
            {playersList.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro: Año */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-mono font-bold uppercase">Año</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="">-- Todos los años --</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {/* SECCIÓN DE RESULTADOS */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500" />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
          <p className="text-sm text-slate-500 font-medium">No se encontraron goles con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id}
              goal={goal}
              isAdmin={true}
              onDeleteSuccess={() => {
                setGoals((prev) => prev.filter((g) => g.id !== goal.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}