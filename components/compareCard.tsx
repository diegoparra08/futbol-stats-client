"use client";

import { PlayerReadDTO, PlayerStatsReadDTO } from "@/types";

interface FullPlayerData {
  player: PlayerReadDTO;
  stats: PlayerStatsReadDTO;
}

interface CompareCardProps {
  playerData: FullPlayerData | null;
  side: "left" | "right";
}

export default function CompareCard({ playerData, side }: CompareCardProps) {
  // Empty state placeholder
  if (!playerData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 text-slate-600 text-sm p-6 text-center select-none">
        <span className="text-3xl mb-2">👤</span>
        Esperando selección...
      </div>
    );
  }

  const { player, stats } = playerData;
  const isLeft = side === "left";

  return (
    <div
      className={`p-5 md:p-6 rounded-xl border bg-slate-900 border-slate-800 shadow-xl flex flex-col justify-between min-h-[420px] lg:min-h-[460px] transition-all ${
        !player.isActive ? "opacity-60 grayscale" : ""
      }`}
    >
      {/* CARD HEADER */}
      <div
        className={`flex flex-col ${isLeft ? "items-start text-left" : "items-end text-right"} mb-6`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-black border ${
              player.isActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-slate-800 text-slate-500 border-slate-700"
            }`}
          >
            OVR {Math.round(player.overallRating || 0)}
          </span>
          {!player.isActive && (
            <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold border border-rose-500/20 uppercase">
              Inactivo
            </span>
          )}
        </div>

        <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide">
          {player.name}
        </h2>
        {player.nickname && (
          <p className="text-xs md:text-sm text-emerald-400 italic">
            {'"'}{player.nickname}{'"'}
          </p>
        )}

        <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider">
          {player.positions?.join(", ") || "N/A"} •{" "}
          {player.preferredFoot === "Left" ? "Izquierda" : "Derecha"}
        </p>
      </div>

      {/* HARD NUMBERS METRICS CONTAINER */}
      <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
        {/* Matches */}
        <div className="flex justify-between items-center md:flex-col md:text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase">
            Partidos
          </p>
          <p className="text-sm md:text-base font-black text-emerald-400">
            {stats.matchesPlayed ?? 0}
          </p>
        </div>

        {/* Goals */}
        <div className="flex justify-between items-center border-t border-slate-800/40 pt-2 mt-1 md:mt-0 md:pt-0 md:border-t-0 md:flex-col md:text-center md:border-x md:border-slate-800/60">
          <p className="text-[10px] text-slate-500 font-bold uppercase">
              Goles
          </p>
          <p className="text-sm md:text-base font-black text-slate-200">
            {stats.goals ?? 0}
          </p>
        </div>

        {/* Assists */}
        <div className="flex justify-between items-center border-t border-slate-800/40 pt-2 mt-1 md:mt-0 md:pt-0 md:border-t-0 md:flex-col md:text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase">
            Asistencias
          </p>
          <p className="text-sm md:text-base font-black text-slate-200">
            {stats.assists ?? 0}
          </p>
        </div>
      </div>

      {/* PLAYER ATTRIBUTES */}
      <div className="space-y-3 pt-3 border-t border-slate-800/40">
        {renderStatRow("Velocidad", Math.round(player.avgSpeed || 0), isLeft)}
        {renderStatRow("Tiro", Math.round(player.avgShooting || 0), isLeft)}
        {renderStatRow("Pase", Math.round(player.avgPassing || 0), isLeft)}
        {renderStatRow("Regate", Math.round(player.avgDribbling || 0), isLeft)}
        {renderStatRow("Defensa", Math.round(player.avgDefending || 0), isLeft)}
        {renderStatRow("Físico", Math.round(player.avgPhysicality || 0), isLeft)}
        {renderStatRow("Fuerza", Math.round(player.avgStrength || 0), isLeft)}
        {player.positions?.includes("GK") && renderStatRow("Arquero", Math.round(player.avgGoalkeeping || 0), isLeft)}
      </div>
    </div>
  );
}

function renderStatRow(
  label: string,
  value: number | undefined,
  isLeft: boolean,
) {
  const numValue = value ?? 0;
  return (
    <div
      className={`flex items-center justify-between text-xs w-full ${isLeft ? "flex-row" : "flex-row-reverse"}`}
    >
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="font-mono font-bold text-slate-200 bg-slate-950/40 px-2 py-0.5 rounded border border-slate-800/60">
        {numValue}
      </span>
    </div>
  );
}
