"use client";

import { useParams, useRouter } from "next/navigation";
import MatchStatsForm from "@/components/matchStatsForm";
import Link from "next/link";

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
     <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
          Estadisticas y Alineación
        </h1>
        <Link
          href="/matches"
          className="inline-flex items-center cursor-pointer gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium mb-1 hover:text-slate-300"
        >
          ⬅️Volver
        </Link>
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