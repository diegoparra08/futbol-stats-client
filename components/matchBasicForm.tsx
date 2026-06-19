"use client";

import {
  MatchSaveDTO,
  MatchUpdateDTO,
  MatchDetailCreateDto,
} from "@/types";
import { API_BASE_URL } from "@/services/api";
import { useState, useEffect } from "react";


interface PlayerFromDB {
  id: number;
  name: string;
}

interface MatchFormData {
  matchDate: string;
  location: string;
  matchDetails: MatchDetailCreateDto[];
}

interface MatchBasicInfoFormProps {
  initialData?: MatchUpdateDTO & { id?: number };
  onSubmitSuccess: () => void;
}

export default function MatchBasicForm({
  initialData,
  onSubmitSuccess,
}: MatchBasicInfoFormProps) {
  const isEditMode = !!initialData;

  // Estados para la lógica dinámica de alineación
  const [playersList, setPlayersList] = useState<PlayerFromDB[]>([]);
  const [playersPerTeam, setPlayersPerTeam] = useState<number>(5); // Por defecto Fútbol 5

  const [matchFormData, setMatchFormData] = useState<MatchFormData>({
    matchDate: initialData?.matchDate ? initialData.matchDate.substring(0, 16) : "",
    location: initialData?.location || "",
    matchDetails: [],
  });

  const [loading, setLoading] = useState(false);

  // Cargar los jugadores de la Base de Datos al montar el componente para mostrarlos en el selector
  useEffect(() => {
    if (!isEditMode) {
      const fetchPlayers = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/Player`); 
          const data = await response.json();

          setPlayersList(data.data || data); 
        } catch (error) {
          console.error("Error cargando jugadores:", error);
        }
      };
      fetchPlayers();
    }
  }, [isEditMode]);

// Manejar el cambio de jugador en un Select específico
  const handlePlayerSelectChange = (teamSide: 0 | 1, index: number, playerId: number) => {
    setMatchFormData((prev) => {

      const updatedDetails = [...prev.matchDetails];
      
      // analizar si ya se ha insertado el jugador en la posición actual
      const existingIndex = updatedDetails.findIndex(
        (d) => d.team === teamSide && updatedDetails.filter(x => x.team === teamSide).indexOf(d) === index
      );

      const newDetail: MatchDetailCreateDto = { playerId, team: teamSide };

      if (existingIndex >= 0) {
        updatedDetails[existingIndex] = newDetail; // Reemplazar
      } else {
        updatedDetails.push(newDetail); // Agregar nuevo
      }

      return { ...prev, matchDetails: updatedDetails };
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && initialData?.id) {
        const updatePayload: MatchUpdateDTO = {
          matchDate: matchFormData.matchDate,
          location: matchFormData.location,
        };

        const response = await fetch(`${API_BASE_URL}/api/Match/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (response.ok) onSubmitSuccess();
      } else {
        // Filtrar los selects que se quedaron vacíos (Id = 0)
        const cleanDetails = matchFormData.matchDetails.filter(d => d.playerId > 0);

        const createPayload: MatchSaveDTO = {
          matchDate: matchFormData.matchDate,
          location: matchFormData.location,
          matchDetails: cleanDetails,
        };
        
        const response = await fetch(`${API_BASE_URL}/api/Match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        });

        if (response.ok) onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error al procesar el partido:", error);
    } finally {
      setLoading(false);
    }
  };

  // renderizar los N selects de un equipo segun lo que el usuario seleccione
  const renderTeamSelects = (teamSide: 0 | 1) => {
    return Array.from({ length: playersPerTeam }).map((_, index) => {
      
      const currentSelection = matchFormData.matchDetails.filter(d => d.team === teamSide)[index];
      
      return (
        <div key={index} className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">Jugador {index + 1}</label>
          <select
            value={currentSelection?.playerId || ""}
            onChange={(e) => handlePlayerSelectChange(teamSide, index, Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            required={!isEditMode}
          >
            <option value="">-- Seleccionar --</option>
            {playersList.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
      <h2 className="text-lg font-bold text-slate-200">
        {isEditMode ? "📝 Editar Información" : "➕ Crear Nuevo Partido"}
      </h2>

      {/* Inputs Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Fecha</label>
          <input
            type="datetime-local"
            value={matchFormData.matchDate}
            onChange={(e) => setMatchFormData({ ...matchFormData, matchDate: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Lugar</label>
          <input
            type="text"
            value={matchFormData.location}
            onChange={(e) => setMatchFormData({ ...matchFormData, location: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
      </div>

      {/* Seleccionar alineación de equipos si es modo creación */}
      {!isEditMode && (
        <div className="border-t border-slate-800 pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Alineaciones del Partido</h3>
              <p className="text-xs text-slate-500">Selecciona el formato de juego y asigna los jugadores.</p>
            </div>
            
            {/* Selector de tamaño de equipo */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-slate-400 px-2">Jugadores por Equipo:</span>
              <select
                value={playersPerTeam}
                onChange={(e) => {
                  setPlayersPerTeam(Number(e.target.value));
                  setMatchFormData(prev => ({ ...prev, matchDetails: [] })); // Reseteamos alineación al cambiar tamaño
                }}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-bold focus:outline-none"
              >
                <option value={5}>5 vs 5</option>
                <option value={6}>6 vs 6</option>
                <option value={7}>7 vs 7</option>
                <option value={8}>8 vs 8</option>
                <option value={9}>9 vs 9</option>
                <option value={10}>10 vs 10</option>
                <option value={11}>11 vs 11</option>
              </select>
            </div>
          </div>

          {/* Grilla de Equipos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
            {/* Columna Equipo A */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest pb-1 border-b border-emerald-500/20">
                 Equipo A
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderTeamSelects(0)} {/* TEAM_A */}
              </div>
            </div>

            {/* Columna Equipo B */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest pb-1 border-b border-teal-500/20">
                 Equipo B
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderTeamSelects(1)} {/* TEAM_B */}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-2.5 rounded text-slate-950 transition-colors"
      >
        {loading ? "Procesando..." : isEditMode ? "Guardar Cambios" : "Crear Partido con Alineación"}
      </button>
    </form>
  );
}