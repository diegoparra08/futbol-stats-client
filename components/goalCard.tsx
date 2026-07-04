"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/services/api";
import { GoalReadDTO } from "@/types";

interface GoalCardProps {
  goal: GoalReadDTO;
  isAdmin?: boolean;
  onDeleteSuccess?: () => void;
}

export default function GoalCard({ goal, isAdmin = false, onDeleteSuccess }: GoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const toastConfig = {
    duration: 3000,
    position: "top-right" as const,
    style: { background: "#0f172a", color: "#cbd5e1", border: "1px solid #1e293b" },
    iconTheme: { primary: "#ef4444", secondary: "#0f172a" },
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este reporte de gol?")) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Goal/${goal.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      toast.success("¡Gol eliminado con éxito!", {
        ...toastConfig,
        iconTheme: { primary: "#10b981", secondary: "#0f172a" },
      });
      onDeleteSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Error al intentar eliminar el gol", toastConfig);
    } finally {
      setIsDeleting(false);
    }
  };

  //  Función para redireccionar al formulario en modo edición
  const handleEditRedirect = () => {
    // Redirige al GoalForm pasándole el ID del gol y el ID del partido. para traer solo los jugadores de ese partido
    router.push(`/goals/${goal.id}/update?matchId=${goal.matchId}`);
  };

  const formatGoalDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4 shadow-md backdrop-blur-xs transition-all hover:border-slate-700">
      
      {/* Información del Gol */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="font-mono font-black text-sm px-2.5 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 bg-slate-950/40">
          {`${goal.minute}'`}
        </div>

        <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-slate-200 tracking-tight truncate">
              {goal.playerName}
            </p>
            
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {goal.assistedByPlayerName && (
                <span className="text-xs text-slate-400 truncate">
                  asist. <span className="text-slate-300 font-medium">{goal.assistedByPlayerName}</span>
                </span>
              )}
              
              {goal.isPenalty && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 tracking-wider">
                  Penal
                </span>
              )}

              {goal.isFreeKick && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border bg-teal-500/10 text-teal-400 border-teal-500/20 tracking-wider">
                  Tiro Libre
                </span>
              )}
            </div>
          </div>

          {goal.matchDate && (
            <div className="text-[11px] text-slate-500 font-mono font-medium sm:text-right shrink-0 bg-slate-950/20 px-2 py-0.5 rounded-md border border-slate-800/40">
              {formatGoalDate(goal.matchDate)}
            </div>
          )}
        </div>
      </div>

      {/* 🛠️ Acciones de Administrador (Editar y Eliminar) */}
      {isAdmin && (
        <div className="flex items-center gap-1 shrink-0">
          {/* Botón de Editar */}
          <button
            onClick={handleEditRedirect}
            className="text-slate-500 hover:text-emerald-400 p-2 rounded-lg hover:bg-slate-950/40 transition-colors"
            title="Editar gol"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>

          {/* Botón de Eliminar */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-950/40 transition-colors disabled:opacity-50"
            title="Eliminar gol"
          >
            {isDeleting ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}