import PlayerForm from "@/components/playerForm";
import Link from "next/dist/client/link";
import Image from "next/image";

export default function NewPlayerPage() {
  return (
   
    <div className="max-w-2xl mx-auto p-6">
       <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto text-left">
          <Link href="/" className="shrink-0">
            <Image
              src="/icon.svg"
              alt="Inicio"
              width={40}
              height={40}
              className="w-10 h-10 sm:w-12 sm:h-12 mb-9"
            />
          </Link>
          <h1 className="text-2xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
         Registrar Nuevo Jugador
      </h1>
          </div>
      
      <Link href="/players"  className="inline-flex items-center mt-4 cursor-pointer gap-3 bg-slate-950/60 px-6 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium mb-1 hover:text-slate-300">
      ⬅️ 
      </Link>
        </div>
      <PlayerForm mode="create" />
    </div>
  );
}