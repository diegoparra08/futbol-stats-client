"use client";

import { useState, useEffect } from "react";
import { MatchReadDTO } from "@/types";
import { matchService } from "@/services/matchService";
import MatchCard from "@/components/matchCard";
import Link from "next/link";

interface MatchListProps {
  initialMatches: MatchReadDTO[];
}

export default function MatchList({ initialMatches }: MatchListProps) {
  const [matches, setMatches] = useState<MatchReadDTO[]>(initialMatches);
  const [locationSearch, setLocationSearch] = useState("");

  const today = new Date(); //se obtiene la fecha actual
  const actualYear = today.getFullYear();
  const actualMonth = String(today.getMonth() + 1).padStart(2, "0"); //se obtiene el mes actual y se agrega un 0 si es menor a dos numeros por formato.

  const [selectedMonth, setSelectedMonth] = useState(actualMonth);
  const [selectedYear, setSelectedYear] = useState(actualYear);

  const [loading, setLoading] = useState(false);

  const monthsOptions = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

  const yearsOptions = [
    String(actualYear - 1),
    String(actualYear),
    String(actualYear + 1),
  ];

  useEffect(() => {
    const fetchNewData = async () => {
      setLoading(true);
      try {
        const matchList = await matchService.getAllMatches();
        setMatches(matchList);
      } catch (error) {
        console.error("Error cargando partidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewData();
  }, [selectedMonth, selectedYear]);

  const filteredMatches = matches.filter((match) => {
  const targetPeriod = `${selectedYear}-${selectedMonth}`;

  const matchPeriod = match.matchDate.substring(0, 7);

  const matchesPeriod = matchPeriod === targetPeriod;
  const matchesLocation = match.location
    ? match.location.toLowerCase().includes(locationSearch.toLowerCase())
    : true;

  return matchesPeriod && matchesLocation;
});

  const handleClearFilters = () => {
    setLocationSearch("");
    setSelectedMonth(actualMonth);
    setSelectedYear(actualYear);
  };

  return (
    <div>
      {/* Barra de Herramientas de Partidos */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-900 p-4 rounded-xl border border-slate-800 items-end">
        {/* Buscador de canchas */}
        <div className="flex-1 w-full">
          <label className="block text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">
            Buscar por Cancha / Sede
          </label>
          <input
            type="text"
            placeholder="Ej. Campin, Sede Norte..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        {/* Filtro Dinámico de Mes y Año */}
      <div className="w-full md:w-80 flex gap-2">
  {/* Selector de Mes */}
  <div className="flex-1">
    <label className="block text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">
      Mes
    </label>
    <select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
    >
      {monthsOptions.map((m) => (
        <option key={m.value} value={m.value}>
          🗓️ {m.label}
        </option>
      ))}
    </select>
  </div>

  {/* Selector de Año */}
  <div className="w-28">
    <label className="block text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">
      Año
    </label>
    <select
      value={selectedYear}
      onChange={(e) => setSelectedYear(Number(e.target.value))}
      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
    >
      {yearsOptions.map((year) => (
        <option key={year} value={year}>
          ⭐ {year}
        </option>
      ))}
    </select>
  </div>
</div>

        {/* Contenedor de Botonesro */}
        <div className="w-full md:w-auto flex items-center gap-3 justify-end">
          {/* Botón Nuevo Partido */}
          <Link
            href="/partidos/crear"
            className="inline-flex items-center text-sm uppercase cursor-pointer gap-2 bg-slate-950/60 px-4 py-2.5 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium hover:text-slate-200 w-full md:w-auto justify-center"
          >
            Nuevo Partido <span className="text-slate-400">➕</span>
          </Link>

          {/* Botón Quitar Filtros */}
          <button
            onClick={() => {
              handleClearFilters();
            }}
            className="inline-flex items-center text-sm uppercase cursor-pointer gap-2 bg-slate-950/60 px-4 py-2.5 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium hover:text-rose-400 w-full md:w-auto justify-center hover:bg-rose-950/20"
          >
            Quitar Filtros <span className="text-rose-400">❌</span>
          </button>
        </div>
      </div>

      {/* Estado de Consulta e Indicador de Carga */}
      {loading ? (
        <div className="p-8 text-center text-emerald-400 font-medium animate-pulse">
          Consultando historial de encuentros...
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-slate-500">
          No hay partidos registrados en este periodo.
        </div>
      ) : (
        /* lista de partidos */
        <div className="grid gap-4 grid-cols-1">
          {filteredMatches.map((match) => (
            <MatchCard 
            key={match.id}
            match={match} />   
          ))}
        </div>
      )}
    </div>
  );
}
