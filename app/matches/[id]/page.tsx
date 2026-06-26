import { matchService } from "@/services/matchService";
import StatusBadge from "@/components/statusBadge";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;

  const match = await matchService.getMatchById(Number(id));

  if (!match) {
    return (
      <div className="text-center p-8 text-slate-500">
        Partido no encontrado.
      </div>
    );
  }

  const formattedDate = new Date(match.matchDate).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { goalsA, goalsB, squadA, squadB, stats } = processMatchData(match);

  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100">
      {/* Cabecera del Partido */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
          Detalles del Partido
        </h1>
        <Link
          href="/matches"
          className="inline-flex items-center cursor-pointer gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium mb-1 hover:text-slate-300"
        >
          ⬅️Volver
        </Link>
      </div>

      {/* Render de datos puros */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <h2 className="text-2xl font-black text-center mb-4">
          Equipo A{" "}
          <span className="text-emerald-400">
            {match.teamAScore} - {match.teamBScore}
          </span>{" "}
          Equipo B
        </h2>

        <div className="text-center mb-4">
          <StatusBadge status={match.status} />
        </div>

        <p className="text-center text-sm text-slate-400">
          📍 Cancha: {match.location}
        </p>

        <p className="text-center text-sm text-slate-400 mb-6">
          Fecha: {formattedDate}
        </p>

        <div className="flex justify-center w-full">
          <Link
            href={`/matches/${match.id}/update`}
            className="inline-flex items-center justify-center gap-2 bg-slate-950/60 px-4 py-1.5 rounded-lg border border-slate-800 select-none hover:border-slate-600 transition-colors text-slate-400 text-xs font-semibold hover:text-slate-200 w-full max-w-[180px]"
          >
            Editar Partido <span className="text-slate-400 text-sm">✏️</span>
          </Link>
        </div>
      </div>

      {/*Contenedor inferior */}

      <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-8">
        {/* Goles*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x md:divide-slate-800">
          {/* Columna Equipo A */}
          <div className="md:pr-6 space-y-3">
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Goles Equipo A
            </h4>
            {goalsA.map((goal) => (
              <div
                key={goal.id}
                className="text-sm text-slate-200 border-l-2 border-emerald-500/30 pl-3"
              >
                <span className="font-mono text-emerald-400 font-bold mr-2">
                  {`${goal.minute}'`}
                </span>
                {goal.playerName}
              </div>
            ))}
            {goalsA.length === 0 && (
              <p className="text-xs text-slate-650 italic">
                Sin goles marcados.
              </p>
            )}
          </div>

          {/* Columna Equipo B */}
          <div className="md:pl-6 space-y-3 md:items-end md:text-right">
            <h4 className="text-[10px] font-black text-teal-400 uppercase tracking-widest">
              Goles Equipo B
            </h4>
            {goalsB.map((goal) => (
              <div
                key={goal.id}
                className="text-sm text-slate-200 border-l-2 md:border-l-0 md:border-r-2 border-teal-500/30 pl-3 md:pr-3"
              >
                <span className="font-mono text-teal-400 font-bold mr-2 md:mr-0 md:ml-2">
                  {`${goal.minute}'`}
                </span>
                {goal.playerName}
              </div>
            ))}
            {goalsB.length === 0 && (
              <p className="text-xs text-slate-650 italic">
                Sin goles marcados.
              </p>
            )}
          </div>
        </div>

        {/* Alineaciones */}
        <div className="grid grid-cols-2 gap-4 border border-slate-800 p-4 rounded-xl bg-slate-950/20">
          <div>
            {squadA.map((p) => (
              <p key={p.playerId} className="text-sm text-slate-300">
                {" "}
                {p.playerName}
              </p>
            ))}
          </div>
          <div className="text-right">
            {squadB
              .filter(
                (player, index, self) =>
                  self.findIndex((t) => t.playerId === player.playerId) ===
                  index,
              )
              .map((p) => (
                <p key={p.playerId} className="text-sm text-slate-400">
                  {p.playerName}{" "}
                </p>
              ))}
          </div>
        </div>

        {/* BARRAS DE ESTADÍSTICAS */}
        <div className="space-y-4">
          <div>
            {/* Recuperaciones */}
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>{stats.recoveriesA}</span>
              <span className="text-slate-500">RECUPERACIONES</span>
              <span>{stats.recoveriesB}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full flex overflow-hidden">
              <div
                className="bg-emerald-500"
                style={{
                  width: `${stats.recoveriesA + stats.recoveriesB > 0 ? (stats.recoveriesA / (stats.recoveriesA + stats.recoveriesB)) * 100 : 50}%`,
                }}
              />
              <div
                className="bg-teal-500"
                style={{
                  width: `${stats.recoveriesA + stats.recoveriesB > 0 ? (stats.recoveriesB / (stats.recoveriesA + stats.recoveriesB)) * 100 : 50}%`,
                }}
              />
            </div>
            {/* Tacleadas */}
            <div className="flex justify-between text-xs font-mono text-slate-300 mt-4">
              <span>{stats.tacklesA}</span>
              <span className="text-slate-500">TACLEADAS</span>
              <span>{stats.tacklesB}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full flex overflow-hidden">
              <div
                className="bg-emerald-500"
                style={{
                  width: `${stats.tacklesA + stats.tacklesB > 0 ? (stats.tacklesA / (stats.tacklesA + stats.tacklesB)) * 100 : 50}%`,
                }}
              />
              <div
                className="bg-teal-500"
                style={{
                  width: `${stats.tacklesB + stats.tacklesB > 0 ? (stats.tacklesB / (stats.tacklesA + stats.tacklesB)) * 100 : 50}%`,
                }}
              />
            </div>
            {/* faltas */}
            <div className="flex justify-between text-xs font-mono text-slate-300 mt-4">
              <span>{stats.foulsA}</span>
              <span className="text-slate-500">FALTAS</span>
              <span>{stats.foulsB}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full flex overflow-hidden">
              <div
                className="bg-emerald-500"
                style={{
                  width: `${stats.foulsA + stats.foulsB > 0 ? (stats.foulsA / (stats.foulsA + stats.foulsB)) * 100 : 50}%`,
                }}
              />
              <div
                className="bg-teal-500"
                style={{
                  width: `${stats.foulsB + stats.foulsB > 0 ? (stats.foulsB / (stats.foulsA + stats.foulsB)) * 100 : 50}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Botón de actualización*/}
        <div className="flex justify-center w-full pt-2">
          <Link
            href={`/matches/${match.id}/stats`}
            className="inline-flex items-center justify-center gap-2 bg-slate-950/60 px-6 py-2.5 rounded-lg border border-slate-800 select-none hover:border-slate-600 transition-colors text-slate-400 text-xs font-semibold hover:text-slate-200 w-full sm:max-w-md text-center"
          >
            Actualizar Alineaciones / Estadísticas{" "}
          </Link>
        </div>
      </div>
    </main>
  );
}

//Funcion que segrega las estadisticas y alineaciones por equipo
import { MatchReadDTO, GoalReadDTO } from "@/types";

export function processMatchData(match: MatchReadDTO) {
  //Alineaciones por equipo
  const squadA =
    match.matchDetails?.filter(
      (d) =>
        d.team?.toLowerCase() === "teama" ||
        d.team?.toLowerCase() === "equipo a",
    ) || [];
  const squadB =
    match.matchDetails?.filter(
      (d) =>
        d.team?.toLowerCase() === "teamb" ||
        d.team?.toLowerCase() === "equipo b",
    ) || [];

  // crear un set para buscar los IDs de los jugadores del equipo A
  const playerIdsTeamA = new Set(squadA.map((p) => p.playerId));

  // almacenar los goles seprarados por equipo
  const goalsA: GoalReadDTO[] = [];
  const goalsB: GoalReadDTO[] = [];

  match.goals?.forEach((goal) => {
    if (playerIdsTeamA.has(goal.playerId)) {
      goalsA.push(goal);
    } else {
      goalsB.push(goal);
    }
  });

  // sumar estadisticas de rendimiento
  const stats = {
    recoveriesA: squadA.reduce((acc, curr) => acc + curr.recoveries, 0),
    recoveriesB: squadB.reduce((acc, curr) => acc + curr.recoveries, 0),
    foulsA: squadA.reduce((acc, curr) => acc + curr.foulsCommitted, 0),
    foulsB: squadB.reduce((acc, curr) => acc + curr.foulsCommitted, 0),
    tacklesA: squadA.reduce((acc, curr) => acc + curr.tackles, 0),
    tacklesB: squadB.reduce((acc, curr) => acc + curr.tackles, 0),
  };

  return {
    squadA,
    squadB,
    goalsA,
    goalsB,
    stats,
  };
}
