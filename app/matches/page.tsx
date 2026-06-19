import MatchList from "@/components/matchList";
import Link from "next/link";

export default function MatchesPage() {

  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center justify-between mb-6">       
        <h1 className="text-2xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
           Gestión de Partidos
        </h1>
        <Link 
          href="/"  
          className="inline-flex items-center cursor-pointer gap-3 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium mb-1 hover:text-slate-300"
        >
          ⬅️Inicio
        </Link>
      </div>
     <MatchList initialMatches={[]} />
    </main>
  );
}


