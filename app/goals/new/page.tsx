import Link from "next/link";
import GoalForm from "@/components/goalForm"; 
import { API_BASE_URL } from "@/services/api";

interface PageProps {
  searchParams: Promise<{ matchId?: string }>;
}

interface MatchLineupResponse {
  data?: { matchDetails: Array<{ playerId: number; playerName: string }> };
  matchDetails?: Array<{ playerId: number; playerName: string }>;
}

export default async function GoalCreatePage({ searchParams }: PageProps) {
  const { matchId } = await searchParams;

  if (!matchId) {
    return (
      <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 italic">Error: Falta el ID del partido.</p>
        <Link href="/matches" className="text-emerald-400 font-bold hover:underline text-sm">⬅️ Volver</Link>
      </main>
    );
  }

  let playersOptions: Array<{ playerId: number; playerName: string }> = [];

  try {
    const matchResponse = await fetch(`${API_BASE_URL}/api/Match/${matchId}`, { cache: "no-store" });
    if (matchResponse.ok) {
      const matchData: MatchLineupResponse = await matchResponse.json();
      const details = matchData.data?.matchDetails || matchData.matchDetails || [];
      playersOptions = details.map((d) => ({
        playerId: d.playerId,
        playerName: d.playerName || `Jugador #${d.playerId}`,
      }));
    }
  } catch (error) {
    console.error("Error al precargar datos:", error);
  }

  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 max-w-2xl">
      <div className="mb-6">
        <Link href={`/matches/${matchId}`} className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200">
          ⬅️ Volver 
        </Link>
      </div>
      <GoalForm matchId={Number(matchId)} players={playersOptions} />
    </main>
  );
}