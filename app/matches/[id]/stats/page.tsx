"use client";

import { useParams, useRouter } from "next/navigation";
import MatchStatsForm from "@/components/matchStatsForm";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/logoutButton";

export default function MatchStatsPage() {
  const params = useParams();
  const router = useRouter();
  
  // Capturamos el ID de la URL dinámicamente y lo convertimos a número
  const matchId = Number(params.id);


  const handleSuccess = () => {

    setTimeout(() => {
      router.push("/matches");
      router.refresh(); 
    }, 1500);
  };

  if (!matchId) {
    return (
      <div className="flex items-center justify-center min-h-100 text-slate-400">
        ID de partido no válido o no encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Encabezado de la página */}
     
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
              Estadisticas y Alineacións
            </h1>
          </div>

          {/* Logout en móvil*/}
          <div className="md:hidden shrink-0">
            <LogoutButton />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/matches"
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

      {/* Formulario de Estadísticas Defensivas y Contadores */}
      <div className="shadow-2xl shadow-emerald-950/10">
        <MatchStatsForm 
          matchId={matchId} 
          onSubmitSuccess={handleSuccess} 
        />
      </div>

    </div>
  );
}