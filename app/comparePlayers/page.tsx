"use client";

import { useEffect, useState } from "react";
import { PlayerReadDTO, PlayerStatsReadDTO } from "@/types";
import { playerService } from "@/services/playerService";
import Link from "next/link";
import CompareCard from "@/components/compareCard";

interface playerDetails {
  player: PlayerReadDTO;
  stats: PlayerStatsReadDTO;
}

export default function ComparePlayers() {
  const [playerList, setPlayerList] = useState<PlayerReadDTO[]>([]);
  const [selectedId1, setSelectedId1] = useState<number>(0);
  const [selectedId2, setSelectedId2] = useState<number>(0);

  //aca se cargan los jugadores completos para obtener sus estadisticas
  const [player1, setPlayer1] = useState<playerDetails | null>(null);
  const [player2, setPlayer2] = useState<playerDetails | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  //vamos a crear una funcion para saber que jugador se seleecion y ejecutar el useEffect para cargar las estadisticas del jugador seleccionado

  useEffect(() => {
    const loadSelectors = async () => {
      try {
        const data = await playerService.getAllPlayers(false);
        setPlayerList(data);
      } catch (error) {
        console.error("Error al cargar la lista:", error);
      }
    };
    loadSelectors();
  }, []);

  const loadCompareData = async (playerId: number, side: "left" | "right") => {
    setLoadingStats(true);
    try {
      // Buscamos los datos básicos que se trajo la lista al cargar el componente
      const skills = playerList.find((p) => p.id === playerId);
      // fetch al backend traer  goles/asistencias/partidos
      const stats = await playerService.getPlayerStats(playerId);

      if (skills && stats) {
        const fullDetails: playerDetails = { player: skills, stats: stats };

        if (side === "left") {
          setPlayer1(fullDetails);
        } else {
          setPlayer2(fullDetails);
        }
      }
    } catch (error) {
      console.error(`Error cargando jugador del lado ${side}:`, error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLeftSelect = (value: string) => {
    const id = Number(value) || 0; // Si es un string vacío o inválido, será 0

    setSelectedId1(id);

    if (id !== 0) {
      loadCompareData(id, "left");
    } else {
      setPlayer1(null); // El objeto del jugador sí puede seguir siendo null si no hay datos
    }
  };

  const handleRightSelect = (value: string) => {
    const id = Number(value) || 0;

    setSelectedId2(id);

    if (id !== 0) {
      loadCompareData(id, "right");
    } else {
      setPlayer2(null);
    }
  };

  return (
    //<div className="p-6 max-w-6xl mx-auto min-h-screen text-slate-200">
    <div className="p-4 md:p-6 w-full max-w-[95%] xl:max-w-[85%] mx-auto min-h-screen text-slate-200">
      
{/* HEADER */}
<div className="grid grid-cols-1 md:flex md:items-center md:justify-between gap-4 w-full border-b border-slate-800/40 pb-4 mb-8">
  
  {/* TITLE */}
  <div className="w-1/2 md:w-auto text-left">
    <h1 className="text-xl md:text-2xl font-black text-emerald-400 uppercase tracking-wider whitespace-nowrap">
      📊 Comparar Jugadores
    </h1>
  </div>

  {/* BUTTON VOLVER */}
  <div className="w-1/2 md:w-auto flex justify-start md:justify-end">
    <Link
      href="/"
      className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold uppercase tracking-wider transition-all shadow-md w-full md:w-auto text-center"
    >
      ⬅️ Volver al Inicio
    </Link>
  </div>

</div>

      {/* SELECTORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="block text-xs text-slate-400 font-bold mb-1 uppercase">
            Jugador A
          </label>
          <select
            value={selectedId1}
            onChange={(e) => handleLeftSelect(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm focus:border-emerald-500 outline-none text-slate-200"
          >
            <option value={0}>Selecione un jugador...</option>
            {playerList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 font-bold mb-1 uppercase">
            Jugador B
          </label>
          <select
            value={selectedId2}
            onChange={(e) => handleRightSelect(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm focus:border-emerald-500 outline-none text-slate-200"
          >
            <option value={0}>Selecione un jugador...</option>
            {playerList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingStats && (
        <div className="text-center text-xs text-emerald-400 animate-pulse mb-4">
          ⚽ Sincronizando estadísticas...
        </div>
      )}

      {/* VERSUS CARDS CONTAINER */}
      <div className="flex flex-col md:flex-row gap-6 w-full items-stretch justify-between">
        <div className="w-full md:w-1/2 min-w-[320px]">
          <CompareCard playerData={player1} side="left" />
        </div>
        <div className="w-full md:w-1/2 min-w-[320px]">
          <CompareCard playerData={player2} side="right" />
        </div>
      </div>
    </div>
  );
}
