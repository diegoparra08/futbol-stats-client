"use client";

import { MatchSaveDTO, MatchUpdateDTO, MatchDetailCreateDto } from "@/types";
import { matchService } from "@/services/matchService";
import { API_BASE_URL } from "@/services/api";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FullTacticalBoard } from "@/components/fullTacticalBoard";

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
  initialData?: MatchUpdateDTO & { id?: number; status?: string };
  onSubmitSuccess: () => void;
}

const MATCH_STATUSES = [
  { id: "0", label: "Programado" },
  { id: "1", label: "En Juego" },
  { id: "2", label: "Finalizado" },
  { id: "3", label: "Cancelado" },
];

export default function MatchBasicForm({
  initialData,
  onSubmitSuccess,
}: MatchBasicInfoFormProps) {
  const isEditMode = !!initialData;

  // Estados para la lógica dinámica de alineación
  const [playersList, setPlayersList] = useState<PlayerFromDB[]>([]);
  const [playersPerTeam, setPlayersPerTeam] = useState<number>(5); // Por defecto Fútbol 5

  const [onlyStatusEdit, setOnlyStatusEdit] = useState<boolean>(false);

  // Estado local para manejar el select del estado de manera reactiva
  const [currentStatus, setCurrentStatus] = useState<string>(() => {
    return initialData?.status ? String(initialData.status) : "0";
  });

  const [matchFormData, setMatchFormData] = useState<MatchFormData>({
    matchDate: initialData?.matchDate
      ? initialData.matchDate.substring(0, 16)
      : "",
    location: initialData?.location || "",
    matchDetails: [],
  });

  const [loading, setLoading] = useState(false);
  const isAdmin = true; //Cambiar esto cuando implementemos el control de acceso

  useEffect(() => {
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
  }, []);

  // Manejar el cambio de jugador en un Select específico
  const handlePlayerSelectChange = (
    teamSide: 0 | 1,
    index: number,
    playerId: number,
  ) => {
    const isDuplicate = matchFormData.matchDetails.some(
      (d) => d.playerId === playerId,
    );

    if (playerId > 0 && isDuplicate) {
      toast.error("Este jugador ya está en la alineación", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#0f172a",
          color: "#cbd5e1",
          border: "1px solid #1e293b",
        },
        iconTheme: {
          primary: "#ef4444",
          secondary: "#0f172a",
        },
      });
      return;
    }

    // setMatchFormData((prev) => {
    //   const updatedDetails = [...prev.matchDetails];

    //   const existingIndex = updatedDetails.findIndex(
    //     (d) =>
    //       d.team === teamSide &&
    //       updatedDetails.filter((x) => x.team === teamSide).indexOf(d) ===
    //         index,
    //   );

    //   const newDetail: MatchDetailCreateDto = { playerId, team: teamSide };

    //   if (existingIndex >= 0) {
    //     updatedDetails[existingIndex] = newDetail;
    //   } else {
    //     updatedDetails.push(newDetail);
    //   }

    //   return { ...prev, matchDetails: updatedDetails };
    // });

   setMatchFormData((prev) => {
    const updatedDetails = [...prev.matchDetails];

    // Asignar el índice táctico si se juega con 8 o más jugadores
    const positionIndex = playersPerTeam >= 8 ? index : null;

    // Helper para comparar equipos soportando number (0/1) o string ("TeamA"/"TeamB")
    const checkIsSameTeam = (teamVal: string | number) => {
      if (typeof teamVal === "number") {
        return teamVal === teamSide;
      }
      return teamVal === (teamSide === 0 ? "TeamA" : "TeamB");
    };

    // 2. Buscar si ya existe un detalle asignado a esta casilla/equipo
    const existingIndex = updatedDetails.findIndex((d) => {
      const isSameTeam = checkIsSameTeam(d.team);

      // Si tiene índice táctico asignado, comparamos directamente por casilla
      if (d.tacticalPositionIndex !== undefined && d.tacticalPositionIndex !== null) {
        return isSameTeam && d.tacticalPositionIndex === index;
      }

      // De lo contrario, comparamos por posición relativa dentro del equipo
      const teamItems = updatedDetails.filter((x) => checkIsSameTeam(x.team));
      return isSameTeam && teamItems.indexOf(d) === index;
    });

    if (existingIndex >= 0) {
      // 3. MODO EDICIÓN: Preserva datos previos (goles, faltas, etc.)
      const existingDetail = updatedDetails[existingIndex];

      updatedDetails[existingIndex] = {
        ...existingDetail,
        playerId,
        team: teamSide,
        tacticalPositionIndex: positionIndex,
      };
    } else {
      // 4. MODO CREACIÓN
      const newDetail: MatchDetailCreateDto = {
        playerId,
        team: teamSide,
        tacticalPositionIndex: positionIndex,
      };

      updatedDetails.push(newDetail);
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

        const response = await fetch(
          `${API_BASE_URL}/api/Match/${initialData.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          },
        );

        if (response.ok) onSubmitSuccess();
      } else {
        const cleanDetails = matchFormData.matchDetails.filter(
          (d) => d.playerId > 0,
        );

        const createPayload: MatchSaveDTO = {
          matchDate: matchFormData.matchDate,
          location: matchFormData.location,
          matchDetails: cleanDetails,
        };
console.log(createPayload);
        const response = await fetch(`${API_BASE_URL}/api/Match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        });

        if (response.ok) onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error al procesar el partido:", error);
      toast.error("Hubo un error al guardar los datos del partido", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#0f172a",
          color: "#cbd5e1",
          border: "1px solid #1e293b",
        },
        iconTheme: {
          primary: "#ef4444",
          secondary: "#0f172a",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejador del cambio de estado del partido
  const handleStatusChange = async (statusId: string) => {
    setCurrentStatus(statusId); // Actualización visual inmediata en el select

    if (!isEditMode || !initialData?.id) return;

    try {
      //petivion a service
      const updatedStatus = await matchService.updateMatchStatus(
        initialData.id,
        statusId,
      );
      if (updatedStatus) {
        toast.success("Estado del partido actualizado en vivo", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#0f172a",
            color: "#cbd5e1",
            border: "1px solid #1e293b",
          },
        });
      }
    } catch (error) {
      console.error("Error actualizando el estado del partido:", error);
      toast.error("No se pudo actualizar el estado en el servidor");
    }
  };

  const renderTeamSelects = (teamSide: 0 | 1) => {
    return Array.from({ length: playersPerTeam }).map((_, index) => {
      const currentSelection = matchFormData.matchDetails.filter(
        (d) => d.team === teamSide,
      )[index];

      return (
        <div key={index} className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-500 font-mono font-bold uppercase">
            Jugador {index + 1}
          </label>

          <select
            value={currentSelection?.playerId || ""}
            onChange={(e) =>
              handlePlayerSelectChange(teamSide, index, Number(e.target.value))
            }
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            required={!isEditMode}
          >
            <option value="">-- Seleccionar --</option>

            {playersList.map((player) => {
              const isAlreadySelected = matchFormData.matchDetails.some(
                (d) => d.playerId === player.id,
              );
              const isSelectedInCurrentSelect =
                currentSelection?.playerId === player.id;

              return (
                <option
                  key={player.id}
                  value={player.id}
                  disabled={isAlreadySelected && !isSelectedInCurrentSelect}
                  className={
                    isAlreadySelected && !isSelectedInCurrentSelect
                      ? "text-slate-600 italic"
                      : ""
                  }
                >
                  {player.name}
                  {isAlreadySelected && !isSelectedInCurrentSelect
                    ? " (Seleccionado)"
                    : ""}
                </option>
              );
            })}
          </select>
        </div>
      );
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <h2 className="text-lg font-bold text-slate-200">
          {isEditMode ? "📝 Editar Información" : "➕ Crear Nuevo Partido"}
        </h2>

        {/* Checkbox de control para activar solo la edición de estado en vivo */}
        {isEditMode && isAdmin && (
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <input
              type="checkbox"
              id="onlyStatusEdit"
              checked={onlyStatusEdit}
              onChange={(e) => setOnlyStatusEdit(e.target.checked)}
              className="accent-emerald-500 h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="onlyStatusEdit"
              className="text-xs text-slate-400 font-medium cursor-pointer select-none"
            >
              Solo actualizar estado en vivo
            </label>
          </div>
        )}
      </div>

      {/* Inputs Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
            Fecha
          </label>
          <input
            type="datetime-local"
            value={matchFormData.matchDate}
            onChange={(e) =>
              setMatchFormData({ ...matchFormData, matchDate: e.target.value })
            }
            disabled={isEditMode && onlyStatusEdit}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
            required={!onlyStatusEdit}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
            Lugar
          </label>
          <input
            type="text"
            value={matchFormData.location}
            onChange={(e) =>
              setMatchFormData({ ...matchFormData, location: e.target.value })
            }
            disabled={isEditMode && onlyStatusEdit}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
            required={!onlyStatusEdit}
          />
        </div>

        {/* Campo de Estado - Solo se muestra o habilita correctamente en modo edición */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase">
              Estado del Partido
            </label>
            {isEditMode && onlyStatusEdit && (
              <span className="text-[10px] text-emerald-400 font-mono animate-pulse">
                ● Cambios en tiempo real activados
              </span>
            )}
          </div>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isEditMode && !onlyStatusEdit}
            className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
            required
          >
            {MATCH_STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Seleccionar alineación de equipos si es modo creación */}
      {!isEditMode && (
        <div className="border-t border-slate-800 pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Alineaciones del Partido
              </h3>
              <p className="text-xs text-slate-500">
                Selecciona el formato de juego y asigna los jugadores.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-slate-400 px-2">
                Jugadores por Equipo:
              </span>
              <select
                value={playersPerTeam}
                onChange={(e) => {
                  setPlayersPerTeam(Number(e.target.value));
                  setMatchFormData((prev) => ({ ...prev, matchDetails: [] }));
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
            {/* Columna Equipo A */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest pb-1 border-b border-emerald-500/20">
                Equipo A
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderTeamSelects(0)}
              </div>
            </div>

            {/* Columna Equipo B */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest pb-1 border-b border-teal-500/20">
                Equipo B
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderTeamSelects(1)}
              </div>
            </div>
          </div>
          {/* Seccion de Tableros Tacticos */}
          {playersPerTeam >= 8 && (
            <div className="my-6 w-full">
              <FullTacticalBoard
                playersPerTeam={playersPerTeam}
                selectedDetails={matchFormData.matchDetails}
                playersList={playersList}
              />
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (isEditMode && onlyStatusEdit)}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-2.5 rounded text-slate-950 transition-colors disabled:cursor-not-allowed"
      >
        {loading
          ? "Procesando..."
          : isEditMode
            ? onlyStatusEdit
              ? "Estado Actualizado en Vivo"
              : "Guardar Cambios de Fecha y Lugar"
            : "Crear Partido con Alineación"}
      </button>
    </form>
  );
}
