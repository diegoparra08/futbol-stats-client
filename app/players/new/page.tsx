import PlayerForm from "@/components/playerForm";
import Link from "next/dist/client/link";

export default function NewPlayerPage() {
  return (
   
    <div className="max-w-2xl mx-auto p-6">
       <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
        🏃‍♂️ Registrar Nuevo Jugador
      </h1>
      <Link href="/"  className="inline-flex items-center mt-4 cursor-pointer gap-3 bg-slate-950/60 px-6 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium mb-1 hover:text-slate-300">
      ⬅️ Inicio
      </Link>
        </div>
      <PlayerForm mode="create" />
    </div>
  );
}