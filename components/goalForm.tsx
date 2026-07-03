"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api";

interface GoalUpdateDTO {
  minute: number;
  playerId: number;
  isPenalty: boolean;
  isFreeKick: boolean;
  assistedByPlayerId: number | null;
}

interface GoalCreateDTO extends GoalUpdateDTO {
  matchId: number;
}

interface PlayerOption {
  playerId: number;
  playerName: string;
}

interface GoalFormProps {
  matchId: number;
  players: PlayerOption[];
  initialData?: GoalUpdateDTO & { id?: number };
  onSubmitSuccess?: () => void; 
  onCancel?: () => void;
}

export default function GoalForm({
  matchId,
  players,
  initialData,
  onSubmitSuccess,
  onCancel,
}: GoalFormProps) {
  const isEditMode = !!initialData;

const router = useRouter();

  // Estados del formulario
const [playerId, setPlayerId] = useState<number>(() => initialData?.playerId ?? 0);
const [minute, setMinute] = useState<number | "">(() => initialData?.minute ?? "");
const [assistedByPlayerId, setAssistedByPlayerId] = useState<number>(() => initialData?.assistedByPlayerId ?? 0);
const [isPenalty, setIsPenalty] = useState<boolean>(() => initialData?.isPenalty ?? false);
const [isFreeKick, setIsFreeKick] = useState<boolean>(() => initialData?.isFreeKick ?? false);
const [submitting, setSubmitting] = useState<boolean>(false);


const handleSubmit = async (e: React.SyntheticEvent) => {
  e.preventDefault();

  // Configuración de estilo idéntica a la que sí funciona
  const toastConfig = {
    duration: 3000,
    position: "top-right" as const,
    style: {
      background: "#0f172a",
      color: "#cbd5e1",
      border: "1px solid #1e293b",
    },
    iconTheme: {
      primary: "#ef4444",
      secondary: "#0f172a",
    },
  };

  //validaciones
  if (!playerId || playerId === 0) {
    toast.error("⚠️ Por favor, selecciona al autor del gol.", toastConfig);
    return;
  }

  if (minute === "" || minute === undefined || minute === null) {
    toast.error("Por favor, ingresa el minuto en el que ocurrió el gol.", toastConfig);
    return;
  }

  if (Number(minute) < 1 || Number(minute) > 120) {
    toast.error("Por favor, ingresa un minuto válido entre 1 y 120.", toastConfig);
    return;
  }

  if (playerId === assistedByPlayerId) {
    toast.error("El autor del gol no puede ser la misma persona que asiste.", toastConfig);
    return;
  }

  setSubmitting(true);

  try {
    const bodyData: GoalCreateDTO | GoalUpdateDTO = isEditMode
      ? {
          playerId,
          minute: Number(minute),
          isPenalty,
          isFreeKick,
          assistedByPlayerId: assistedByPlayerId > 0 ? assistedByPlayerId : null,
        }
      : {
          matchId,
          playerId,
          minute: Number(minute),
          isPenalty,
          isFreeKick,
          assistedByPlayerId: assistedByPlayerId > 0 ? assistedByPlayerId : null,
        };

    const url = isEditMode
      ? `${API_BASE_URL}/api/Goal/${initialData?.id}`
      : `${API_BASE_URL}/api/Goal`;

    const response = await fetch(url, {
      method: isEditMode ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error();

    onSubmitSuccess?.();
    router.push(`/matches/${matchId}`);
    router.refresh();

  } catch (error) {
    console.error(error);
    toast.error(isEditMode ? "Error al actualizar el gol" : "Error al registrar el gol", toastConfig);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <>  
    <Toaster />
     <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-slate-900 border border-slate-800/80 p-5 sm:p-6 rounded-xl space-y-5 shadow-xl backdrop-blur-xs"
    >
      {/* Título Dinámico */}
      <div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
          {isEditMode ? "Modificar Gol" : "Nuevo Gol"}
        </span>
        <h3 className="text-lg font-black uppercase text-slate-100 tracking-tight mt-0.5">
          {isEditMode ? "Editar Reporte de Gol" : "Registrar Gol"}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Autor del Gol */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Autor del Gol 
          </label>
          <select
            value={playerId}
            onChange={(e) => setPlayerId(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500/50 transition-colors w-full"
          >
            <option value={0}>-- Selecciona el Jugador --</option>
            {players.map((p) => (
              <option key={p.playerId} value={p.playerId}>
                {p.playerName}
              </option>
            ))}
          </select>
        </div>

        {/* Minuto */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Minuto del Gol 
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={minute}
            onChange={(e) => setMinute(e.target.value !== "" ? Number(e.target.value) : "")}
            placeholder="Ej. 45"
            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500/50 transition-colors w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Asistencia (Opcional) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          Asistencia de (Opcional) 
        </label>
        <select
          value={assistedByPlayerId}
          onChange={(e) => setAssistedByPlayerId(Number(e.target.value))}
          className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-hidden focus:border-emerald-500/50 transition-colors w-full"
        >
          <option value={0}>Sin asistencia (Jugada individual / Rebote)</option>
          {players
            // Evitamos que el autor se asista a sí mismo en la lista visual de opciones
            .filter((p) => p.playerId !== playerId)
            .map((p) => (
              <option key={p.playerId} value={p.playerId}>
                {p.playerName}
              </option>
            ))}
        </select>
      </div>

     {/* Toggles / Checkboxes Estilizados */}
<div className="grid grid-cols-2 gap-4 pt-1">
  {/* Penalty */}
  <div
    onClick={() => setIsPenalty(!isPenalty)}
    className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer select-none transition-all text-xs font-bold uppercase tracking-wider ${
      isPenalty
        ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
        : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-750"
    }`}
  >
    <input type="checkbox" checked={isPenalty} readOnly className="hidden" />
    {isPenalty ? "Penal" : "Penal"}
  </div>

  {/* Tiro Libre */}
  <div
    onClick={() => setIsFreeKick(!isFreeKick)}
    className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer select-none transition-all text-xs font-bold uppercase tracking-wider ${
      isFreeKick
        ? "bg-teal-500/10 border-teal-500/40 text-teal-400"
        : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-750"
    }`}
  >
    <input type="checkbox" checked={isFreeKick} readOnly className="hidden" />
    {isFreeKick ? "Tiro Libre" : "Tiro Libre"}
  </div>
</div>

      {/* Botonera de Control */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/60">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer bg-transparent hover:bg-slate-800 px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wide transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700/50 disabled:text-slate-400 text-slate-950 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/20"
        >
          {submitting ? "Guardando..." : isEditMode ? "Actualizar Gol" : "Registrar Gol"}
        </button>
      </div>
    </form>
    </>
   
  );
}