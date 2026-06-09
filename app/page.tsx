import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl text-center">
        <h1 className="text-3xl font-extrabold mb-2 text-emerald-400">
           Futbol Stats
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          Panel de administración de partidos y rendimiento amateur.
        </p>

        <div className="flex flex-col gap-4">
          {/* Enlace a Jugadores */}
          <Link 
            href="/players" 
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            📋 Ver Plantilla de Jugadores
          </Link>

          {/* Enlace provisional a Partidos (Dará 404 por ahora hasta que la crees) */}
          <Link 
            href="/matches" 
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            🏆 Gestionar Partidos
          </Link>
           <Link 
            href="/comparePlayers" 
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            🆚 Comparar Jugadores
          </Link>
        </div>
      </div>
    </div>
  );
}