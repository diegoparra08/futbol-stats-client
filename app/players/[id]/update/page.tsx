import PlayerForm from "@/components/playerForm";
import { PlayerReadDTO } from "@/types";
import Link from "next/dist/client/link";
import Image from "next/image";
import LogoutButton from "@/components/logoutButton";
import { API_BASE_URL } from "@/services/api";

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
      cache: "no-store", // Evitamos que Next.js cachee datos viejos si el jugador cambia
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

            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
               Editar Jugador: {playerData.name}
            </h1>
          </div>

          {/* Logout en móvil*/}
          <div className="md:hidden shrink-0">
            <LogoutButton />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-slate-950/60 px-4 py-2 rounded-lg border border-slate-800 select-none hover:border-slate-700 transition-colors text-slate-400 font-medium hover:text-slate-300 text-sm"
          >
            ⬅️ Inicio
          </Link>

          {/* Logout en pantallas md+ */}
          <div className="hidden md:block shrink-0">
            <LogoutButton />
          </div>
        </div>
      </div>

      <PlayerForm mode="edit" initialData={playerData} />
    </div>
  );
}
