"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import toast, { Toaster } from "react-hot-toast";
import StatSlider from "@/components/statSlider";
import { ratingService } from "@/services/ratingService";

export default function RatingForm({ playerId }: { playerId: number }) {
  const router = useRouter(); // Instanciamos el enrutador
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stats, setStats] = useState({
    speed: 70,
    shooting: 70,
    passing: 70,
    dribbling: 70,
    defending: 70,
    physicality: 70,
    strength: 70,
    goalkeeping: 50,
  });

  const handleStatChange = (statName: string, newValue: number) => {
    setStats((prev) => ({ ...prev, [statName]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await ratingService.createRating({
        playerId,
        ...stats,
      });

      if (result && result.succeeded) {
        toast.success("¡Calificación guardada con éxito!", {
          duration: 3000,
          position: "top-center",
        });

        setTimeout(() => {
          router.push("/players");
        }, 1500);
      } else {
        throw new Error(
          result?.message || "No se pudo procesar la calificación.",
        );
      }
    } catch (error: unknown) {
      //mensaje por defecto de respaldo
      let message = "Por favor intenta más tarde.";

      if (error instanceof Error) {
        message = error.message;
      }

      // error por regla de 15 días para recalificar
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
        
        setTimeout(() => {
          router.push("/players");
        }, 1500);
      } else {
        // este es para error genérico o técnico
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
        {/* slides para agregar la calificaci{on} */}
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
          {isSubmitting ? "Guardando..." : "Guardar Calificación"}
        </button>
      </form>
    </>
  );
}
