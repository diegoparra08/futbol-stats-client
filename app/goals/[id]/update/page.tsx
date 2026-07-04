import Link from "next/link";
import GoalForm from "@/components/goalForm"; 
import { API_BASE_URL } from "@/services/api";
import { goalService } from "@/services/goalServices";

interface PageProps {
  params: Promise<{ id: string }>;    
  searchParams: Promise<{ matchId?: string }>; 
}

interface MatchLineupResponse {
  data?: { matchDetails: Array<{ playerId: number; playerName: string }> };
  matchDetails?: Array<{ playerId: number; playerName: string }>;
}

export default async function GoalUpdatePage({ params, searchParams }: PageProps) {

  const { id } = await params;
  const { matchId } = await searchParams;

  if (!matchId) {
    return (
      <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 italic">⚠️ Error: Falta el ID del partido para filtrar la nómina.</p>
        <Link href="/matches" className="text-emerald-400 font-bold hover:underline text-sm">⬅️ Volver a Partidos</Link>
      </main>
    );
  }

  let playersOptions: Array<{ playerId: number; playerName: string }> = [];
  let initialGoalData = null;

  try {
    // se ejecutan ambas solicitudes para traer losjugadores y el gol
    const [matchResponse, goalResponse] = await Promise.all([

      fetch(`${API_BASE_URL}/api/Match/${matchId}`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/api/Goal/${id}`, { cache: "no-store" })
    ]);
console.log(" id partido y gol",matchResponse, goalResponse);
    // Procesa los jugadores del partido
    if (matchResponse.ok) {
      const matchData: MatchLineupResponse = await matchResponse.json();
      const details = matchData.data?.matchDetails || matchData.matchDetails || [];
      playersOptions = details.map((d) => ({
        playerId: d.playerId,
        playerName: d.playerName || `Jugador #${d.playerId}`,
      }));
    }

    // Procesa la información vieja del gol para mandarla al formulario
    if (goalResponse.ok) {
      const goalData = await goalResponse.json();
      const goal = goalData.data || goalData;

      initialGoalData = {
        id: Number(id),
        playerId: goal.playerId,
        minute: goal.minute,
        isPenalty: goal.isPenalty || false,
        isFreeKick: goal.isFreeKick || false,
        assistedByPlayerId: goal.assistedByPlayerId || 0,
      };
    }
  } catch (error) {
    console.error("Error al precargar datos en el servidor:", error);
  }

  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 max-w-2xl">

      <div className="mb-6">
        <Link
          href={`/goals`}
          className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          ⬅️ Cancelar Edición
        </Link>
      </div>

      {/* formilario para actualizar los datos del gol */}
      <GoalForm
        matchId={Number(matchId)}
        players={playersOptions}
        initialData={initialGoalData || undefined}
      />
    </main>
  );
}