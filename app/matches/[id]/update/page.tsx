"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MatchBasicForm from "@/components/matchBasicForm";
import { API_BASE_URL } from "@/services/api";
import { MatchUpdateDTO } from "@/types";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function EditMatchPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.id);

  const [initialData, setInitialData] = useState<MatchUpdateDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchStatus, setMatchStatus] = useState<string | null>(null);

  // Cargar la información actual del partido al montar la página
  useEffect(() => {
    if (!matchId) return;

    const fetchMatchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Match/${matchId}`);
        if (!response.ok) throw new Error("No se pudo obtener el partido");
        
        const data = await response.json();
        const match = data.data || data; 

        setInitialData({
          matchDate: match.matchDate,
          location: match.location,        
        });

        if (match.status !== undefined && match.status !== null) {
          // Aseguramos que se guarde como string para mapearlo fácilmente en el Select
          setMatchStatus(String(match.status));
        }
      } catch (error) {
        console.error("Error al cargar el partido:", error);
        toast.error("Error al cargar los datos del partido");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId]);

  // Notificar al usuario de que se ha actualizado correctamente
  const handleSuccess = () => {
    toast.success("¡Información actualizada con éxito!", {
      duration: 3000,
      position: "top-right",
      style: {
        background: "#0f172a",
        color: "#cbd5e1",
        border: "1px solid #1e293b",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#0f172a",
      },
    });

   //redireccionamos al panel principal
    setTimeout(() => {
      router.push("/matches");
      router.refresh();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Toaster />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
          Modificar Partido
        </h1>
        <Link
          href="/matches"
          className="inline-flex items-center cursor-pointer gap-3 bg-slate-950/60 px-6 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium hover:text-slate-300"
        >
          ⬅️Volver
        </Link>
      </div>

      {initialData && (
        <MatchBasicForm 
          initialData={{ 
            ...initialData, 
            id: matchId,  
            status: matchStatus ?? "0",
          }}
          onSubmitSuccess={handleSuccess}
        />
      )}
    </div>
  );
}