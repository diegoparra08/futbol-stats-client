import Link from "next/link";
import GoalForm from "@/components/goalForm"; 
import { goalService } from "@/services/goalServices";
import { matchService } from "@/services/matchService";
import Image from "next/image";
import LogoutButton from "@/components/logoutButton";

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
      matchService.getMatchById(Number(matchId)),
      goalService.getGoalById(Number(id))
    ]);

    // Procesa los jugadores del partido
    if (matchResponse) {
      const matchData: MatchLineupResponse = matchResponse;
      const details = matchData.data?.matchDetails || matchData.matchDetails || [];
      playersOptions = details.map((d) => ({
        playerId: d.playerId,
        playerName: d.playerName || `Jugador #${d.playerId}`,
      }));
    }

    // Procesa la información vieja del gol para mandarla al formulario
    if (goalResponse) {
      
      const goal = goalResponse;
    
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

 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 w-full">
        {/* Logo + Título y Logout en Móvil */}
        <div className="flex items-center justify-between gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0">
              <Image
                src="/icon.svg"
                alt="Inicio"
                width={40}
                height={40}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </Link>

            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              Gestion de Goles
            </h1>
          </div>

          {/* Logout en móvil*/}
          <div className="md:hidden shrink-0">
            <LogoutButton />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/goals"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium hover:text-slate-300 text-sm"
          >
            ⬅️ Cancelar Edición
          </Link>

          {/* Logout en pantallas md+ */}
          <div className="hidden md:block shrink-0">
            <LogoutButton />
          </div>
        </div>
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