"use client"; 

import MatchBasicForm from "@/components/matchBasicForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function NewPlayerPage() {
  const router = useRouter();

  
  const handleSuccess = () => {
  
    toast.success("¡Partido creado exitosamente!", {
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


    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      <Toaster />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
          Crear Partido
        </h1>
        <Link
          href="/"
          className="inline-flex items-center cursor-pointer gap-3 bg-slate-950/60 px-6 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium hover:text-slate-300"
        >
          ⬅️ Inicio
        </Link>
      </div>

      <MatchBasicForm onSubmitSuccess={handleSuccess} />
    </div>
  );
}