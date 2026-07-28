import Link from "next/link";
import LogoutButton from "@/components/logoutButton";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 max-w-3xl">
      <div className="flex items-center justify-between gap-4 w-full">
  
  {/* 1. Espaciador fantasma (Solo en md/lg para equilibrar el centrado) */}
  <div className="hidden md:block shrink-0 w-10 pointer-events-none aria-hidden" />

  {/* 2. Logo + Textos (Alineado a la izq en móvil, centrado en md/lg) */}
  <div className="flex items-center gap-3 sm:gap-4 min-w-0 md:justify-center md:text-center">
    <Image
      src="/icon.svg"
      alt="Inicio"
      width={40}
      height={40}
      className="w-10 h-10 sm:w-12 sm:h-12 shrink-0"
    />       
    <div className="min-w-0">
      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block truncate">
        Centro de Rendimiento Amateur
      </span>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-50 mt-0.5 truncate">
        Futbol Stats Panel
      </h1>
    </div>
  </div>

  {/* 3. Logout (Siempre a la derecha) */}
  <div className="shrink-0 w-10 flex justify-end">
    <LogoutButton />
  </div>

</div>

      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl text-center">   

          <div className="flex flex-col gap-4">
            {/* Enlace a Jugadores */}
            <Link
              href="/players"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Ver Plantilla de Jugadores
            </Link>

            {/* Enlace provisional a Partidos (Dará 404 por ahora hasta que la crees) */}
            <Link
              href="/matches"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              Gestionar Partidos
            </Link>
            <Link
              href="/comparePlayers"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              Comparar Jugadores
            </Link>
            <Link
              href="/goals"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              Historial de Goles
            </Link>
            <Link
              href="/ratings"
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              Mis Ratings
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
