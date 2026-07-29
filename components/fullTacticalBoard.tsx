"use client";

import React, { useState, useMemo } from "react";
import { FORMATIONS_PRESETS, PositionCoordinate } from "@/types";

interface PlayerReadDTO {
  id: number;
  name: string;
}

interface MatchDetailReadDto {
  playerId: number;
  team: string | number;
}

interface FullTacticalBoardProps {
  playersPerTeam: number;
  selectedDetails: MatchDetailReadDto[];
  playersList: PlayerReadDTO[];
}

export const FullTacticalBoard: React.FC<FullTacticalBoardProps> = ({
  playersPerTeam,
  selectedDetails,
  playersList,
}) => {
  const availableFormations = useMemo(
    () => FORMATIONS_PRESETS[playersPerTeam] || {},
    [playersPerTeam]
  );

  const formationKeys = useMemo(
    () => Object.keys(availableFormations),
    [availableFormations]
  );

  const [formationKeyTeamA, setFormationKeyTeamA] = useState<string>(
    formationKeys[0] || ""
  );
  const [formationKeyTeamB, setFormationKeyTeamB] = useState<string>(
    formationKeys[0] || ""
  );

  const validKeyA = availableFormations[formationKeyTeamA]
    ? formationKeyTeamA
    : formationKeys[0] || "";

  const validKeyB = availableFormations[formationKeyTeamB]
    ? formationKeyTeamB
    : formationKeys[0] || "";

  if (validKeyA !== formationKeyTeamA) setFormationKeyTeamA(validKeyA);
  if (validKeyB !== formationKeyTeamB) setFormationKeyTeamB(validKeyB);

  const detailsA = selectedDetails.filter((d) => d.team === 0 || d.team === "TeamA");
  const detailsB = selectedDetails.filter((d) => d.team === 1 || d.team === "TeamB");

  const playersA = detailsA.map((d) => playersList.find((p) => p.id === d.playerId));
  const playersB = detailsB.map((d) => playersList.find((p) => p.id === d.playerId));

  const positionsA: PositionCoordinate[] = availableFormations[validKeyA] || [];
  const positionsB: PositionCoordinate[] = availableFormations[validKeyB] || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Selector Team B  */}
      <div className="w-full flex items-center justify-between mb-2.5 px-2 bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
          <span className="font-bold text-slate-200 text-xs sm:text-sm">Team B</span>
        </div>
        {formationKeys.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-400 font-medium">Esquema:</label>
            <select
              value={validKeyB}
              onChange={(e) => setFormationKeyTeamB(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-amber-400 text-xs rounded px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {formationKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* --- CANCHA COMPLETA --- */}
      <div className="relative w-full h-135 sm:h-150 bg-emerald-800/80 rounded-xl border-4 border-emerald-500/40 overflow-hidden shadow-inner flex flex-col justify-between my-1">
        {/* Marcaciones de Cancha */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-emerald-300/40 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-24 sm:w-28 h-24 sm:h-28 border-2 border-emerald-300/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-emerald-300/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Portería Superior (B) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 sm:w-44 h-16 sm:h-20 border-b-2 border-x-2 border-emerald-300/40 rounded-b-md pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-6 sm:h-7 border-b-2 border-x-2 border-emerald-300/30 rounded-b-md pointer-events-none" />

        {/* Portería Inferior (A) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 sm:w-44 h-16 sm:h-20 border-t-2 border-x-2 border-emerald-300/40 rounded-t-md pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-6 sm:h-7 border-t-2 border-x-2 border-emerald-300/30 rounded-t-md pointer-events-none" />

        {/*TEAM B */}
        {positionsB.map((pos, index) => {
          const player = playersB[index];
          const numericTop = parseFloat(pos.top.replace("%", ""));
         
          const calculatedTop = `${((100 - numericTop) * 0.46).toFixed(2)}%`;

          return (
            <div
              key={`B-${pos.id}-${index}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
              style={{ top: calculatedTop, left: pos.left }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shadow-md transition-all ${
                  player
                    ? "bg-amber-500 text-slate-950 ring-2 ring-amber-300"
                    : "bg-slate-800/90 text-slate-400 border border-slate-600 border-dashed"
                }`}
              >
                {pos.label}
              </div>
              <span className="text-[9px] font-medium text-slate-100 bg-slate-950/85 px-1 py-0.5 rounded leading-none mt-0.5 max-w-17.5 truncate shadow text-center border border-slate-800">
                {player ? player.name : "Sin asignar"}
              </span>
            </div>
          );
        })}

        {/* TEAM A  */}
        {positionsA.map((pos, index) => {
          const player = playersA[index];
          const numericTop = parseFloat(pos.top.replace("%", ""));
          // Escalado para mitad inferior
          const calculatedTop = `${(54 + numericTop * 0.46).toFixed(2)}%`;

          return (
            <div
              key={`A-${pos.id}-${index}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
              style={{ top: calculatedTop, left: pos.left }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shadow-md transition-all ${
                  player
                    ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-300"
                    : "bg-slate-800/90 text-slate-400 border border-slate-600 border-dashed"
                }`}
              >
                {pos.label}
              </div>
              <span className="text-[9px] font-medium text-slate-100 bg-slate-950/85 px-1 py-0.5 rounded leading-none mt-0.5 max-w-17.5 truncate shadow text-center border border-slate-800">
                {player ? player.name : "Sin asignar"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selector Team A  */}
      <div className="w-full flex items-center justify-between mt-2.5 px-2 bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span className="font-bold text-slate-200 text-xs sm:text-sm">Team A</span>
        </div>
        {formationKeys.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-400 font-medium">Esquema:</label>
            <select
              value={validKeyA}
              onChange={(e) => setFormationKeyTeamA(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-emerald-400 text-xs rounded px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {formationKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};