"use client";
import { useState } from "react";
import { RatingReadDTO } from "@/types"; 

interface RatingCardProps {
  rating: RatingReadDTO;
  onEdit: (rating: RatingReadDTO) => void;
}

export default function RatingCard({ rating, onEdit }: RatingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Calculamos el promedio general de las estadísticas (excluyendo portería si es 0, o promediando todas)
  const calculateOverall = (r: RatingReadDTO): number => {
    const stats = [
      r.speed,
      r.shooting,
      r.passing,
      r.dribbling,
      r.defending,
      r.physicality,
      r.strength,
    ];
    // Si tiene estadísticas de portero significativas, las incluimos en el promedio
    if (r.goalkeeping > 10) {
      stats.push(r.goalkeeping);
    }
    const sum = stats.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / stats.length);
  };

  const overall = calculateOverall(rating);

  // Colores dinámicos según el promedio general estilo carta de juego
  const getOverallColorClass = (val: number) => {
    if (val < 60) return "bg-red-500/10 text-red-400 border-red-500/30";
    if (val < 80) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  };

  // Helper para pintar el mini-badge de cada stat individual en el panel expandido
  const getStatColorClass = (val: number) => {
    if (val < 60) return "text-red-400";
    if (val < 80) return "text-yellow-400";
    return "text-emerald-400";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-700/50">
      
      {/* header de la tarjeta */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-900/20 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Promedio General */}
          <div className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-black text-xl tracking-tight ${getOverallColorClass(overall)}`}>
            {overall}
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 -mt-1">OVR</span>
          </div>
          
       
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Fecha de registro</span>
            <p className="text-sm font-medium text-slate-300">{formatDate(rating.createdAt)}</p>
          </div>
        </div> 

        {/* Flecha de expansión */}
        <div className="text-slate-500 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest hidden sm:inline">
            {isExpanded ? "Ocultar" : "Detalles"}
          </span>
          <svg 
            className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* detalle  */}
      <div 
        className={`transition-all duration-300 ease-in-out border-t border-slate-800/40 overflow-hidden ${
          isExpanded ? "max-h-125 opacity-100 p-6 bg-slate-950/40" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Mapeamos los atributos guardados en el backend */}
          {[
            { label: "Velocidad", val: rating.speed },
            { label: "Tiro", val: rating.shooting },
            { label: "Pase", val: rating.passing },
            { label: "Regate", val: rating.dribbling },
            { label: "Defensa", val: rating.defending },
            { label: "Físico", val: rating.physicality },
            { label: "Fuerza", val: rating.strength },
            { label: "Portería", val: rating.goalkeeping },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/30 flex flex-col items-center">
              <span className="text-xs text-slate-400 font-medium mb-1 truncate w-full text-center">{stat.label}</span>
              <span className={`text-lg font-black ${getStatColorClass(stat.val)}`}>{stat.val}</span>
            </div>
          ))}
        </div>

        {/* Botón de Acción para disparar la actualización */}
        <div className="flex justify-end border-t border-slate-900 pt-4">
          <button
            onClick={() => onEdit(rating)}
            className="inline-flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs py-2 px-4 rounded-xl transition-all duration-200"
          >
            Editar Calificación
          </button>
        </div>
      </div>

    </div>
  );
}