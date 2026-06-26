"use client";

import { useState, useEffect } from "react";
import { PlayerStatUpdateInput, MatchStatsUpdateDTO } from "@/types";
import { matchService } from "@/services/matchService";
import { API_BASE_URL } from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

interface MatchStatsFormProps {
  matchId: number;
  onSubmitSuccess: () => void;
}

export default function MatchStatsForm({ matchId, onSubmitSuccess }: MatchStatsFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<PlayerStatUpdateInput[]>([]);

//se carga los jugadores actuales asignados al partido desde el backend
useEffect(() => {
  const fetchCurrentLineup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Match/${matchId}`);
      const data = await response.json();
      const match = data.data || data;

      // Mapeo corregido según tu consola de desarrollo:
      const initialStats = match.matchDetails.map((detail: any) => ({
        playerId: detail.playerId,
        // Acceso directo a playerName en la raíz del objeto
        playerName: detail.playerName || `Jugador #${detail.playerId}`, 
        // Convesrion de string a número (0 / 1) 
        team: detail.team === "TeamA" ? 0 : 1, 
        recoveries: detail.recoveries || 0,
        tackles: detail.tackles || 0,
        foulsCommitted: detail.foulsCommitted || 0,
      }));

      setStats(initialStats);
    } catch (error) {
      console.error("Error cargando estadísticas iniciales:", error);
      toast.error("No se pudieron cargar los jugadores del partido");
    } finally {
      setLoading(false);
    }
  };

  fetchCurrentLineup();
}, [matchId]);

  // manejar el incremento o decremento de contadores de forma reactiva
  const handleStatChange = (playerId: number, field: keyof PlayerStatUpdateInput, operation: "inc" | "dec") => {
    setStats((prev) =>
      prev.map((player) => {
        if (player.playerId !== playerId) return player;
        
        const currentValue = player[field] as number;
        // Evitamos que los contadores bajen de cero
        const newValue = operation === "inc" ? currentValue + 1 : Math.max(0, currentValue - 1);
        
        return { ...player, [field]: newValue };
      })
    );
  };

  // cambiar de equipo a jugador.
  const handleTeamChange = (playerId: number, newTeam: 0 | 1) => {
    setStats((prev) =>
      prev.map((player) => (player.playerId === playerId ? { ...player, team: newTeam } : player))
    );
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
     
      const payload: MatchStatsUpdateDTO = {
        playersStats: stats.map(({ playerId, team, recoveries, tackles, foulsCommitted }) => ({
          playerId,
          team,
          recoveries,
          tackles,
          foulsCommitted,
        })),
      };

      const success = await matchService.updateMatchPlayerStats(matchId, payload);
      if (success) {
        toast.success("¡Estadísticas y nóminas guardadas exitosamente!");
        onSubmitSuccess();
      } else {
        toast.error("No se pudieron actualizar las estadísticas");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de red al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Separar los jugadores por equipo en la interfaz de usuario
  const teamA = stats.filter((p) => p.team === 0);
  const teamB = stats.filter((p) => p.team === 1);

  const renderPlayerRow = (player: PlayerStatUpdateInput) => (
    <div key={player.playerId} className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-bold text-sm text-slate-200 tracking-tight">{player.playerName}</span>
        
        {/* selector de cambio de equipo */}
        <select
          value={player.team}
          onChange={(e) => handleTeamChange(player.playerId, Number(e.target.value) as 0 | 1)}
          className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
        >
          <option value={0}>Equipo A</option>
          <option value={1}>Equipo B</option>
        </select>
      </div>

      {/* Contadores Estadísticos */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* Recuperaciones */}
        <div className="flex flex-col items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800/40">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recup</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleStatChange(player.playerId, "recoveries", "dec")} className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs select-none">-</button>
            <span className="text-sm font-mono font-bold text-emerald-400">{player.recoveries}</span>
            <button type="button" onClick={() => handleStatChange(player.playerId, "recoveries", "inc")} className="w-5 h-5 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded text-xs font-bold select-none">+</button>
          </div>
        </div>

        {/* Tacleadas */}
        <div className="flex flex-col items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800/40">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tacles</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleStatChange(player.playerId, "tackles", "dec")} className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs select-none">-</button>
            <span className="text-sm font-mono font-bold text-teal-400">{player.tackles}</span>
            <button type="button" onClick={() => handleStatChange(player.playerId, "tackles", "inc")} className="w-5 h-5 flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-slate-950 rounded text-xs font-bold select-none">+</button>
          </div>
        </div>

        {/* Faltas */}
        <div className="flex flex-col items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800/40">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Faltas</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleStatChange(player.playerId, "foulsCommitted", "dec")} className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs select-none">-</button>
            <span className="text-sm font-mono font-bold text-rose-400">{player.foulsCommitted}</span>
            <button type="button" onClick={() => handleStatChange(player.playerId, "foulsCommitted", "inc")} className="w-5 h-5 flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-slate-950 rounded text-xs font-bold select-none">+</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
      <Toaster />
      <div>
        <h3 className="text-base font-bold text-slate-200 uppercase tracking-wide"> Estadisticas y Alineación de Jugadores</h3>
        <p className="text-xs text-slate-500">Edita plantillas y rendimiento defesivo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Equipo A */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest pb-1 border-b border-emerald-500/20"> Planilla Equipo A</h4>
          <div className="flex flex-col gap-3">
            {teamA.length === 0 ? <p className="text-xs italic text-slate-600">Sin jugadores asignados</p> : teamA.map(renderPlayerRow)}
          </div>
        </div>

        {/* Columna Equipo B */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest pb-1 border-b border-teal-500/20"> Planilla Equipo B</h4>
          <div className="flex flex-col gap-3">
            {teamB.length === 0 ? <p className="text-xs italic text-slate-600">Sin jugadores asignados</p> : teamB.map(renderPlayerRow)}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-2.5 rounded text-slate-950 transition-colors disabled:cursor-not-allowed mt-4"
      >
        {saving ? "Guardando Estadísticas..." : "Finalizar y Guardar Reporte"}
      </button>
    </form>
  );
}