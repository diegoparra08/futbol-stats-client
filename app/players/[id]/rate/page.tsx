import Link from "next/link";
import { notFound } from "next/navigation";
import RatingForm from "@/components/ratingForm";
import { playerService } from "@/services/playerService";
import LogoutButton from "@/components/logoutButton";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewRatingPage({ params }: PageProps) {
  const { id } = await params;
  const playerId = Number(id);

  if (isNaN(playerId)) {
    return notFound();
  }

  const isAdmin = false;
  let player = null;
  let errorOcurred = false;

  // se llama a la función getById de la clase playerService para obtener los datos del jugador
  try {
    player = await playerService.getById(playerId);
  } catch (error) {
    console.error(
      "Error al obtener detalles del jugador para la calificación:",
      error,
    );
    errorOcurred = true;
  }

  // error si no existe el jugador o si hubo un error al obtener los datos
  if (!player || errorOcurred) {
    return (
      <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 italic">
          ⚠️ El jugador que intentas calificar no existe o hubo un problema al
          cargar los datos.
        </p>
        <Link
          href="/players"
          className="text-emerald-400 font-bold hover:underline text-sm"
        >
          ⬅️ Volver a Jugadores
        </Link>
      </main>
    );
  }

  const playerName = player.name;

  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 max-w-2xl">
      {/* header */}
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
              Calificaciones
            </h1>
          </div>

          {/* Logout en móvil*/}
          <div className="md:hidden shrink-0">
            <LogoutButton />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/players"
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

      {/* Cabecera del Jugador */}
      <div className="bg-linear-to-r from-slate-900 to-slate-900/40 border border-slate-800/60 p-6 rounded-2xl mb-8 flex items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Nueva Calificación
          </span>
          <h1 className="text-2xl font-black text-slate-50 tracking-tight mt-0.5">
            {playerName}
          </h1>
        </div>
      </div>

      {/* Formulario Interactivo de Sliders */}
      <div className="bg-slate-900/30 border border-slate-800/40 p-6 rounded-2xl backdrop-blur-sm">
        <p className="text-md text-slate-400 mb-6 font-bold">
          Ajusta los atributos basándote en las habilidades del jugador
        </p>
        {!isAdmin && (
          <p className="text-xs text-slate-400 mb-6 italic">
            Nota: Las calificaciones a un mismo jugador se pueden hacer cada 15
            días.
          </p>
        )}
        <RatingForm playerId={playerId} />
      </div>
    </main>
  );
}
