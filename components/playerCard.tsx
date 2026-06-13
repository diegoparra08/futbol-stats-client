"use client";

import { useState, useEffect } from "react";
import { PlayerReadDTO, PlayerStatsReadDTO } from "@/types";
import { playerService } from "@/services/playerService";
import Link from "next/dist/client/link";

interface PlayerCardProps {
  player: PlayerReadDTO;
  onPlayerUpdated: () => void; //Esta viene del padre "playeList" para que se pueda actualizar el estado desde aca.
}

export default function PlayerCard({
  player,
  onPlayerUpdated,
}: PlayerCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<PlayerStatsReadDTO | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const isAdmin = true; //Por desarrollo. Debo cambiarla para obtenerla del token cuando implemente el inicio de sesion.

  useEffect(() => {
    if (!isOpen || stats) return;

    const fetchPlayerStats = async () => {
      setLoadingStats(true);
      try {
        const data = await playerService.getPlayerStats(player.id);
        if (!data) {
          setStats(null);
          return;
        }
        setStats(data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchPlayerStats();
  }, [isOpen, player.id, stats]);

  const handleToggleStatus = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      const isSuccess = await playerService.changePlayerStatus(player.id);

      if (isSuccess) {
        onPlayerUpdated(); //Se envia para actualizar el estado en el padre
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`p-4 rounded-xl border transition-all flex flex-col group shadow-md cursor-pointer select-none ${
        player.isActive
          ? "bg-slate-900 border-slate-800 hover:border-emerald-500/30"
          : "bg-slate-950/40 border-slate-900/80 opacity-75 grayscale"
      }`}
    >
      {/* Contenedor Principal Superior */}
      <div className="flex justify-between items-center w-full">
        <div>
          <div className="flex items-center gap-2">
            {!player.isActive && (
              <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold border border-rose-500/20 uppercase">
                Inactivo
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
            {player.name} {player.nickname ? `"${player.nickname}"` : ""}
          </h2>

          <div className="flex flex-col md:flex-row gap-1 md:gap-6 mt-1">
            <p className="text-xs text-slate-400">
              Posiciones:{" "}
              <span className="text-emerald-400 font-semibold uppercase">
                {player.positions && player.positions.length > 0
                  ? player.positions.join(", ")
                  : "Sin definir"}
              </span>
            </p>
            <p className="text-xs text-slate-400">
              Pie Fuerte:{" "}
              <span className="text-emerald-400 font-semibold capitalize">
                {player.preferredFoot === "Left" ? "izquierdo" : "derecho"}
              </span>
            </p>
          </div>
        </div>

        {/* Rating e Indicador de flecha */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={`text-sm px-3 py-1 rounded-full font-black border ${
                player.isActive
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-slate-800 text-slate-500 border-slate-700"
              }`}
            >
              {Math.round(player.overallRating || 0)}
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Rating
            </span>
          </div>
          <span
            className={`text-slate-500 text-xs transform transition-transform duration-300 ${isOpen ? "rotate-180 text-emerald-400" : ""}`}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Cuerpo del Acordeón Desplegable */}
      {isOpen && (
        <div
          className="mt-4 pt-4 border-t border-slate-800/60 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/*SECCIÓN 1: HABILIDADES*/}
          <div className="space-y-3 mb-4">
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
              Atributos del Jugador
            </h4>

            {renderStatBar("Velocidad", Math.round(player.avgSpeed || 0))}
            {renderStatBar("Tiro", Math.round(player.avgShooting || 0))}
            {renderStatBar("Pase", Math.round(player.avgPassing || 0))}
            {renderStatBar("Regate", Math.round(player.avgDribbling || 0))}
            {renderStatBar("Defensa", Math.round(player.avgDefending || 0))}
            {renderStatBar("Físico", Math.round(player.avgPhysicality || 0))}
            {renderStatBar("Fuerza", Math.round(player.avgStrength || 0))}
            {renderStatBar("Arquero", Math.round(player.avgGoalkeeping || 0))}
          </div>

          {/* SECCIÓN 2: ESTADÍSTICAS COMPLEMENTARIA */}
          <div className="border-t border-slate-800/40 pt-3 mt-3">
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">
              Estadísticas de Temporada
            </h4>

            {loadingStats ? (
              <div className="text-xs text-center text-emerald-400/80 animate-pulse py-4">
                ⚽ Consultando base de datos...
              </div>
            ) : stats ? (
              /* Cuadrícula de recuadros ("cuadrados") adaptada para móvil (grid-cols-2) o PC (md:grid-cols-3) */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-300">
                {/* Cuadrado de Partidos Jugados */}
                <div className="bg-slate-950/80 border border-slate-800/40 p-2.5 rounded-lg">
                  <p className="text-slate-500 font-medium mb-0.5">
                    Partidos Jugados
                  </p>
                  <p className="text-sm font-bold text-emerald-400">
                    {stats.matchesPlayed ?? 0}
                  </p>
                </div>

                {/* Cuadrado de Goles */}
                <div className="bg-slate-950/80 border border-slate-800/40 p-2.5 rounded-lg">
                  <p className="text-slate-500 font-medium mb-0.5">
                    Goles Totales
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {stats.goals ?? 0}
                  </p>
                </div>

                {/* Cuadrado de Asistencias */}
                <div className="bg-slate-950/80 border border-slate-800/40 p-2.5 rounded-lg">
                  <p className="text-slate-500 font-medium mb-0.5">
                    Asistencias
                  </p>
                  <p className="text-sm font-bold text-slate-200">
                    {stats.assists ?? 0}
                  </p>
                </div>

                {/* Boton editar */}

                <Link
                  href={`/players/${player.id}/update`}
                  className="block bg-slate-950/80 border border-slate-800/40 p-2.5 rounded-lg hover:border-slate-700 transition-colors text-slate-300 hover:text-slate-200 text-sm font-bold text-center"
                >
                  Editar Datos Basicos
                </Link>

                {/* Boton Borrar condicional */}
                {isAdmin && (
                  <button
                    onClick={(e) => handleToggleStatus(e)}
                    className={` w-full text-sm font-bold py-1.5 px-3 rounded transition-colors ${
                      player.isActive
                        ? "bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/30"
                        : "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/30"
                    }`}
                  >
                    {player.isActive ? "Desactivar Jugador" : "Activar Jugador"}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-xs text-center text-rose-400/80 py-2">
                ⚠️ No se encontraron estadísticas para este jugador.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  {
    /* Función para renderizar la barra con lógica dinámica de colores */
  }

  function renderStatBar(label: string, value: number | undefined) {
    const numValue = value ?? 0;

    // Lógica de rangos según tus especificaciones
    let colorClass = "bg-rose-500"; // 0 a 35 (Rojo)
    if (numValue >= 36 && numValue <= 60) {
      colorClass = "bg-amber-500"; // 36 a 60 (Naranja)
    } else if (numValue >= 61 && numValue <= 85) {
      colorClass = "bg-lime-400"; // 61 a 85 (Verde claro)
    } else if (numValue >= 86) {
      colorClass = "bg-emerald-500"; // 86 a 100 (Verde intenso)
    }

    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">{label}</span>
          <span
            className={`font-bold px-1.5 py-0.5 rounded text-[11px] bg-slate-950 border border-slate-800 text-slate-200`}
          >
            {numValue}
          </span>
        </div>
        {/* Contenedor de la barra de progreso */}
        <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800/80 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${colorClass}`}
            style={{ width: `${Math.min(Math.max(numValue, 0), 100)}%` }}
          />
        </div>
      </div>
    );
  }
}
