import Link from "next/link";
import { notFound } from "next/navigation";
import RatingForm from "@/components/ratingForm"; 
import { playerService } from "@/services/playerService"; 

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
    console.error("Error al obtener detalles del jugador para la calificación:", error);
    errorOcurred = true;
  }

  // error si no existe el jugador o si hubo un error al obtener los datos
  if (!player || errorOcurred) {
    return (
      <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 italic">⚠️ El jugador que intentas calificar no existe o hubo un problema al cargar los datos.</p>
        <Link href="/players" className="text-emerald-400 font-bold hover:underline text-sm">⬅️ Volver a Jugadores</Link>
      </main>
    );
  }


  const playerName = player.name;
 
 
  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 max-w-2xl">
      {/* Botón de regreso */}
      <div className="mb-6">
        <Link 
          href={`/players`} 
          className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800/80 px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          ⬅️ Volver
        </Link>
      </div>

      {/* Cabecera del Jugador */}
      <div className="bg-linear-to-r from-slate-900 to-slate-900/40 border border-slate-800/60 p-6 rounded-2xl mb-8 flex items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Nueva Calificación</span>
          <h1 className="text-2xl font-black text-slate-50 tracking-tight mt-0.5">{playerName}</h1>
        </div>
      </div>

      {/* Formulario Interactivo de Sliders */}
      <div className="bg-slate-900/30 border border-slate-800/40 p-6 rounded-2xl backdrop-blur-sm">
        <p className="text-md text-slate-400 mb-6 font-bold">
           Ajusta los atributos basándote en las habilidades del jugador
        </p>
        {!isAdmin && <p className="text-xs text-slate-400 mb-6 italic">
            Nota: Las calificaciones a un mismo jugador se pueden hacer cada 15 días.
            </p>}         
        <RatingForm playerId={playerId} />
      </div>
    </main>
  );
}