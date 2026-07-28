"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import RatingCard from "@/components/ratingCard";
import RatingForm from "@/components/ratingForm";
import { RatingReadDTO } from "@/types";
import { ratingService } from "@/services/ratingService";
import { playerService } from "@/services/playerService";
import Image from "next/image";
import LogoutButton from "@/components/logoutButton";

interface PlayerOption {
  id: number;
  name: string;
}

export default function MyRatingsPage() {
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | "">("");

  const [ratings, setRatings] = useState<RatingReadDTO[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(false);

  // Estado para controlar qué calificación se está editando en el modal
  const [editingRating, setEditingRating] = useState<RatingReadDTO | null>(
    null,
  );
  // Carga la lista de jugadores para el filtro al montar el componente
  useEffect(() => {
    let isMounted = true;

    async function loadPlayers() {
      try {
        setLoadingPlayers(true);
        const response: PlayerOption[] = await playerService.getAllPlayers();
        if (isMounted) {
          setPlayers(
            (response || []).map((p: PlayerOption) => ({
              id: p.id,
              name: p.name,
            })),
          );
        }
      } catch (error) {
        console.error("Error al cargar jugadores para el filtro:", error);
        toast.error("No se pudo cargar la lista de jugadores.");
      } finally {
        if (isMounted) setLoadingPlayers(false);
      }
    }

    loadPlayers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Función refactorizada con useCallback para recargar ratings manualmente tras editar
  const reloadRatings = useCallback(async (playerId: number) => {
    try {
      setLoadingRatings(true);
      const response = await ratingService.getPlayerRatingsOwn(playerId);
      setRatings(response || []);
    } catch (error) {
      console.error("Error al cargar calificaciones:", error);
      toast.error("Error al obtener las calificaciones de este jugador.");
    } finally {
      setLoadingRatings(false);
    }
  }, []);

  // Carga las calificaciones cuando cambia el jugador seleccionado de forma limpia
  useEffect(() => {
    if (!selectedPlayerId) return;

    let ignore = false;

    async function loadRatings() {
      setLoadingRatings(true);
      try {
        const response = await ratingService.getPlayerRatingsOwn(
          Number(selectedPlayerId),
        );
        if (!ignore) {
          setRatings(response || []);
        }
      } catch (error: any) {
        if (!ignore) {
         if (error?.status === 401 || error?.message?.includes("expirado")) {
          toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
          
          //  Redirigir al usuario después de 1.5 segundos al login
          setTimeout(() => {
            window.location.href = "/login"; // O router.push("/login");
          }, 1500);
        } else {
          // Para cualquier otro tipo de error 
          toast.error("Error al obtener las calificaciones de este jugador.");
        }
        }
      } finally {
        if (!ignore) {
          setLoadingRatings(false);
        }
      }
    }

    loadRatings();

    return () => {
      ignore = true;
    };
  }, [selectedPlayerId]);

  const handleSelectPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setSelectedPlayerId("");
      setRatings([]);
    } else {
      setSelectedPlayerId(Number(value));
    }
  };

  // Se activa al pulsar el botón "Editar Calificación" en RatingCard
  const handleEditRating = (ratingToEdit: RatingReadDTO) => {
    setEditingRating(ratingToEdit);
  };

  //Callback llamado al guardar la edición exitosamente
  const handleEditSuccess = () => {
    setEditingRating(null);
    if (selectedPlayerId) {
      reloadRatings(Number(selectedPlayerId));
    }
  };

  return (
    <main className="container mx-auto p-6 bg-slate-950 min-h-screen text-slate-100 max-w-3xl">
      <Toaster />

      {/* Header */}

  <div className="flex flex-col gap-4 mb-8 w-full">
  
  {/*titulo y lougout */}
  <div className="flex items-center justify-between gap-4 w-full">
    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
      <Link href="/" className="shrink-0">
        <Image
          src="/icon.svg"
          alt="Inicio"
          width={40}
          height={40}
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
      </Link>

      <div className="min-w-0">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block truncate">
          Centro de Rendimiento
        </span>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-50 mt-0.5 truncate">
          Mis Calificaciones
        </h1>
      </div>
    </div>

    {/* Logout  */}
    <div className="shrink-0">
      <LogoutButton />
    </div>
  </div>

  {/* boton ver jugadores */}
  <div className="flex justify-start md:justify-end w-full">
    <Link
      href="/players"
      className="inline-flex items-center justify-center gap-2 bg-slate-900 border border-slate-800/80 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all w-full md:w-auto"
    >
      Ver Jugadores
    </Link>
  </div>

</div>

      {/* filtro */}
      <div className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-2xl backdrop-blur-sm mb-6">
        <label
          htmlFor="player-filter"
          className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
        >
          Selecciona un jugador para ver tus calificaciones:
        </label>

        <div className="relative">
          {loadingPlayers ? (
            <div className="w-full bg-slate-900/60 border border-slate-800 text-slate-400 text-sm py-3 px-4 rounded-xl animate-pulse">
              Cargando jugadores...
            </div>
          ) : (
            <select
              id="player-filter"
              value={selectedPlayerId}
              onChange={handleSelectPlayer}
              className="w-full bg-slate-900/60 border border-slate-800 text-slate-100 text-sm py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none transition-all"
            >
              <option value="">- Elige un jugador de la lista -</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* lista de calificaciones */}
      <div className="space-y-4">
        {loadingRatings ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 bg-slate-900/30 border border-slate-800/50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : !selectedPlayerId ? (
          <div className="text-center py-16 border border-dashed border-slate-800/60 rounded-2xl bg-slate-900/10">
            <span className="text-4xl">📊</span>
            <h3 className="mt-4 text-sm font-bold text-slate-300">
              Ningún jugador seleccionado
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Selecciona un jugador en el menú desplegable para ver tu historial
              de valoraciones.
            </p>
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800/60 rounded-2xl bg-slate-900/10">
            <span className="text-4xl">👟</span>
            <h3 className="mt-4 text-sm font-bold text-slate-300">
              Aún no has calificado a este jugador
            </h3>
            <Link
              href={`/players/${selectedPlayerId}/rate`}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition-all mt-4"
            >
              Crear Primera Calificación
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              Historial de Calificaciones ({ratings.length})
            </h2>
            {ratings.map((rating) => (
              <RatingCard
                key={rating.id}
                rating={rating}
                onEdit={handleEditRating}
              />
            ))}
          </div>
        )}
      </div>

      {/* modal de edición */}
      {editingRating && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Modo Edición
                </span>
                <h2 className="text-xl font-black text-slate-100">
                  Editar Calificación
                </h2>
              </div>
              <button
                onClick={() => setEditingRating(null)}
                className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800/50 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>

            <RatingForm
              key={editingRating.id}
              playerId={Number(selectedPlayerId)}
              initialData={editingRating}
              onSuccess={handleEditSuccess}
            />
          </div>
        </div>
      )}
    </main>
  );
}
