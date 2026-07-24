"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import StatSlider from "@/components/statSlider";
import { ratingService } from "@/services/ratingService";
import { RatingReadDTO } from "@/types";

interface RatingFormProps {
  playerId: number;
  initialData?: RatingReadDTO;
  onSuccess?: () => void;
}

export default function RatingForm({
  playerId,
  initialData,
  onSuccess,
}: RatingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  //se inicializa con los datos existentes o en 70 por si es creacion nueva
  const [stats, setStats] = useState(() => ({
    speed: initialData?.speed ?? 70,
    shooting: initialData?.shooting ?? 70,
    passing: initialData?.passing ?? 70,
    dribbling: initialData?.dribbling ?? 70,
    defending: initialData?.defending ?? 70,
    physicality: initialData?.physicality ?? 70,
    strength: initialData?.strength ?? 70,
    goalkeeping: initialData?.goalkeeping ?? 50,
  }));

  const handleStatChange = (statName: string, newValue: number) => {
    setStats((prev) => ({ ...prev, [statName]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      //inicia modo edición
      if (isEditMode && initialData) {
        const succeeded = await ratingService.updateRating(initialData.id, {  
          ...stats,
        });

        if (succeeded) {
          toast.success("¡Calificación actualizada con éxito!", {
            duration: 2000,
            position: "top-center",
          });

          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 1500);
          } else {
            setTimeout(() => {
              router.push("/players");
            }, 1500);
          }
        } else {
          throw new Error("No se pudo actualizar la calificación.");
        }
      } else {
        //inicia creación
        const result = await ratingService.createRating({
          playerId,
          ...stats,
        });

        if (result && result.succeeded) {
          toast.success("¡Calificación guardada con éxito!", {
            duration: 3000,
            position: "top-center",
          });

          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 500);
          } else {
            setTimeout(() => {
              router.push("/players");
            }, 1500);
          }
        } else {
          throw new Error(
            result?.message || "No se pudo procesar la calificación."
          );
        }
      }
    } catch (error: unknown) {
      let message = "Por favor intenta más tarde.";

      if (error instanceof Error) {
        message = error.message;
      }

      if (message.includes("Debes esperar")) {
        toast.error(`Recuerda:\n${message}`, {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #f59e0b",
          },
        });
      } else {
        toast.error(`Error:\n${message}`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #ef4444",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatSlider
            label="Velocidad"
            value={stats.speed}
            onChange={(val) => handleStatChange("speed", val)}
          />
          <StatSlider
            label="Tiro"
            value={stats.shooting}
            onChange={(val) => handleStatChange("shooting", val)}
          />
          <StatSlider
            label="Pase"
            value={stats.passing}
            onChange={(val) => handleStatChange("passing", val)}
          />
          <StatSlider
            label="Regate"
            value={stats.dribbling}
            onChange={(val) => handleStatChange("dribbling", val)}
          />
          <StatSlider
            label="Defensa"
            value={stats.defending}
            onChange={(val) => handleStatChange("defending", val)}
          />
          <StatSlider
            label="Físico"
            value={stats.physicality}
            onChange={(val) => handleStatChange("physicality", val)}
          />
          <StatSlider
            label="Fuerza"
            value={stats.strength}
            onChange={(val) => handleStatChange("strength", val)}
          />
          <StatSlider
            label="Portería"
            value={stats.goalkeeping}
            onChange={(val) => handleStatChange("goalkeeping", val)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-200 ${
            isSubmitting
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
          }`}
        >
          {isSubmitting
            ? "Guardando..."
            : isEditMode
              ? "Actualizar Calificación"
              : "Guardar Calificación"}
        </button>
      </form>
    </>
  );
}