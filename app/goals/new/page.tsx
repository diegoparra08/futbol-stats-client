import Link from "next/link";
import GoalForm from "@/components/goalForm"; 
import { API_BASE_URL } from "@/services/api";

// Interfaces mínimas para tipar los parámetros de la URL
interface PageProps {
  searchParams: Promise<{
    matchId?: string;
    goalId?: string; // Si viene este ID, entraremos en modo edición
  }>;
}

// Tipado para la respuesta del back
interface MatchLineupResponse {
  data?: {
    matchDetails: Array<{
      playerId: number;
      playerName: string;
      team: string;
    }>;
  };
  matchDetails?: Array<{
    playerId: number;
    playerName: string;
    team: string;
  }>;
}

export default async function GoalCreatePage({ searchParams }: PageProps) {
  
  const { matchId, goalId } = await searchParams;

  if (!matchId) {
    return (
      <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 italic">
          Error: Falta el ID del partido para gestionar el suceso.
        </p>
        <Link
          href="/matches"
          className="text-emerald-400 font-bold hover:underline text-sm"
        >
          ⬅️ Volver a Partidos
        </Link>
      </main>
    );
  }

  let playersOptions: Array<{ playerId: number; playerName: string }> = [];
  let initialGoalData = null;

  try {
    // Cargamos la nómina del partido para alimentar los selectores del formulario
    const matchResponse = await fetch(`${API_BASE_URL}/api/Match/${matchId}`, {
      cache: "no-store", // Evita problemas de caché si cambian las alineaciones
    });

    if (matchResponse.ok) {
      const matchData: MatchLineupResponse = await matchResponse.json();
      const details =
        matchData.data?.matchDetails || matchData.matchDetails || [];

      // Mapeamos los jugadores asignados al partido
      playersOptions = details.map((d) => ({
        playerId: d.playerId,
        playerName: d.playerName || `Jugador #${d.playerId}`,
      }));
    }

    // Si viene un 'goalId', estamos en modo EDICIÓN: Consultamos sus datos actuales al backend
    if (goalId) {
      const goalResponse = await fetch(`${API_BASE_URL}/api/Goal/${goalId}`, {
        cache: "no-store",
      });

      if (goalResponse.ok) {
        const goalData = await goalResponse.json();
        const goal = goalData.data || goalData;

        // Estructuramos la información previa exactamente como la espera el GoalForm
        initialGoalData = {
          id: Number(goalId),
          playerId: goal.playerId,
          minute: goal.minute,
          isPenalty: goal.isPenalty || false,
          isFreeKick: goal.isFreeKick || false,
          assistedByPlayerId: goal.assistedByPlayerId || 0,
        };
      }
    }
  } catch (error) {
    console.error("Error al precargar datos del reporte de gol:", error);
  }

  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 max-w-2xl">
      {/* Botón superior de retorno al partido */}
      <div className="mb-6">
        <Link
          href={`/matches/${matchId}`}
          className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          ⬅️ Volver 
        </Link>
      </div>

      {/* Render del Formulario Dinámico */}
      <GoalForm
        matchId={Number(matchId)}
        players={playersOptions}
        initialData={initialGoalData || undefined}
      />
    </main>
  );
}
