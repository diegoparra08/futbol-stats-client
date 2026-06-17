"use client";

import { MatchReadDTO } from "@/types";
import StatusBadge from "@/components/statusBadge";
import Link from "next/link";

interface MatchCardProps {
  match: MatchReadDTO;
}

export default function MatchCard({ match }: MatchCardProps) {


    const formattedDate = new Date(match.matchDate).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });


  const isCompleted = match.status?.toLowerCase() !== "scheduled" && match.status?.toLowerCase() !== "cancelled";

return (
    <Link
      href={`/matches/${match.id}`}
      className={`p-4 rounded-xl border transition-all flex flex-col group shadow-md cursor-pointer select-none ${
        isCompleted
          ? "bg-slate-900 border-slate-800 hover:border-emerald-500/30"
          : "bg-slate-950/40 border-slate-900/80 opacity-85 hover:border-blue-500/20"
      }`}
    >
      {/* Contenedor Principal */}
      <div className="flex justify-between items-center w-full gap-4">
        
        {/* datos basicos*/}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
           <StatusBadge status={match.status} />
            <span className="text-[11px] text-slate-500 font-medium font-mono">
              #{match.id}
            </span>
          </div>

          {/* Marcador / Equipos */}
          <h2 className="text-base md:text-lg font-bold text-slate-200 group-hover:text-emerald-400 transition-colors flex items-center gap-3">
            <span className="text-slate-100">Equipo A</span>
            <span className="font-mono text-xl text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400 px-1">
              {isCompleted ? `${match.teamAScore} - ${match.teamBScore}` : "vs"}
            </span>
            <span className="text-slate-400 font-medium">Equipo B</span>
          </h2>

          {/* Detalles Inferiores: Ubicación y Fecha */}
          <div className="flex flex-col md:flex-row gap-1 md:gap-6 mt-1.5">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              📅 Fecha:{" "}
              <span className="text-slate-300 font-medium">
                {formattedDate}
              </span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              📍 Cancha:{" "}
              <span className="text-emerald-400 font-semibold capitalize tracking-wide">
                {match.location || "Sin definir"}
              </span>
            </p>
          </div>
        </div>

        {/* div resumen de goles */}
        <div className="flex items-center gap-4">
          
          {/* contador de goles del partido */}
          {isCompleted && (
            <div className="hidden sm:flex flex-col items-end gap-0.5">
              <span className="text-sm px-3 py-1 rounded-full font-black border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono">
                {match.teamAScore + match.teamBScore}
              </span>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">
                Goles Totales
              </span>
            </div>
          )}

          {/* Tipo flecha para ver detalles */}
          <span className="text-slate-600 text-sm transform group-hover:translate-x-1 group-hover:text-emerald-400 transition-all duration-300">
            ▶
          </span>
        </div>

      </div>
    </Link>
  );
    
   
};
  