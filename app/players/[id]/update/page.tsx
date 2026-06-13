import PlayerForm from "@/components/playerForm";
import { PlayerReadDTO } from "@/types";
import Link from "next/dist/client/link";
import {API_BASE_URL} from "@/services/api";

interface ApiResponse {
  success: boolean;
  message: string;
  data: PlayerReadDTO; // El jugador viene aquí adentro
}

interface Props {
  params: Promise<{ id: string }>; 
}

export default async function EditPlayerPage({ params }: Props) {
  const { id } = await params;

  //Traer los datos actuales del jugador del api para pre-llenar el formularino
  let playerData: PlayerReadDTO | undefined;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/Player/${id}`, {
      cache: 'no-store' // Evitamos que Next.js cachee datos viejos si el jugador cambia
    });
    if (response.ok) {
      const result: ApiResponse = await response.json();
      playerData = result.data; // datos del jugador. luego se le pasa al form.
    }
  } catch (error) {
    console.error("Error cargando el jugador para edición:", error);
  }

  if (!playerData) {
    return (
      <div className="text-center p-12 text-slate-400">
        ⚠️ No se pudo cargar la información del jugador o no existe.
      </div>
    );
  }

  // Se envian los datos al componente form con el mode edit para que sepa que es una actualización y no creación
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500">
          📝 Editar Jugador: {playerData.name}
        </h1>
        <Link
          href="/"
          className="inline-flex items-center mt-4 cursor-pointer gap-3 bg-slate-950/60 px-6 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium mb-1 hover:text-slate-300"
        >
          ⬅️ Inicio
        </Link>
      </div>
      <PlayerForm mode="edit" initialData={playerData} />
    </div>
  );
}