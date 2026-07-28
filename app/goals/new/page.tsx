import Link from "next/link";
import GoalForm from "@/components/goalForm";
import { API_BASE_URL } from "@/services/api";
import Image from "next/image";
import LogoutButton from "@/components/logoutButton";

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
        <Link
          href="/matches"
          className="text-emerald-400 font-bold hover:underline text-sm"
        >
          ⬅️ Volver
        </Link>
      </main>
    );
  }

  let playersOptions: Array<{ playerId: number; playerName: string }> = [];

  try {
    const matchResponse = await fetch(`${API_BASE_URL}/api/Match/${matchId}`, {
      cache: "no-store",
    });
    if (matchResponse.ok) {
      const matchData: MatchLineupResponse = await matchResponse.json();
      const details =
        matchData.data?.matchDetails || matchData.matchDetails || [];
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
              Plantilla de Jugadores
            </h1>
          </div>

          {/* Logout en móvil*/}
          <div className="md:hidden shrink-0">
            <LogoutButton />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href={`/matches/${matchId}`}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium hover:text-slate-300 text-sm"
          >
            ⬅️ Volver
          </Link>

          {/* Logout en pantallas md+ */}
          <div className="hidden md:block shrink-0">
            <LogoutButton />
          </div>
        </div>
      </div>
      <GoalForm matchId={Number(matchId)} players={playersOptions} />
    </main>
  );
}
