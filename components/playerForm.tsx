"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayerReadDTO, PlayerCreateDTO, PlayerUpdateDTO } from "@/types";

interface PlayerFormProps {
  mode: "create" | "edit";
  initialData?: PlayerReadDTO; // Opcional: solo se pasa cuando estamos editando
}

interface PlayerFormData {
  name: string;
  nickname: string;
  photoUrl: string;
  preferredFoot: "Left" | "Right";
  positions: number[];
  age: string;
  height: string;
}

const AVAILABLE_POSITIONS = [
  { id: 0, label: "GK" },
  { id: 1, label: "CB" },
  { id: 2, label: "RB" },
  { id: 3, label: "LB" },
  { id: 4, label: "DCM" },
  { id: 5, label: "CM" },
  { id: 6, label: "CAM" },
  { id: 7, label: "RM" },
  { id: 8, label: "LM" },
  { id: 9, label: "RW" },
  { id: 10, label: "LW" },
  { id: 11, label: "CF" },
  { id: 12, label: "ST" },
];

export default function PlayerForm({ mode, initialData }: PlayerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); //evita que se haga doble submit mientras se procesa el primero
  const BASE_URL = "https://localhost:7088/api/Player";

  const [formData, setFormData] = useState<PlayerFormData>(() => {
    //Para editar un jugador existente se debe cumplir este condicional de abajo. Si no sigue hasta el siguiente return.
    if (mode === "edit" && initialData) {
      console.log(
        "Inicializando formulario en modo edición con datos:",
        initialData.positions,
      ); ///*******ACA LLEGA BIEN LAS POSICIONES */

      //const mappedPositions = (initialData.positions || []).map((pos) =>
       // typeof pos === "string" ? parseInt(pos, 10) || 0 : pos,
      //);

      const mappedPositions = (initialData.positions || []).map((posLabel) => {
        // posLabel va a ser "CF", "ST", etc.

        // Buscamos en tu lista de posiciones disponibles la que coincida con la sigla
        const foundPosition = AVAILABLE_POSITIONS.find(
          (p) => p.label.toUpperCase() === String(posLabel).toUpperCase(),
        );

        // Si la encuentra, devuelve su id numérico (ej: 11 o 12). Si no, devuelve 0.
        return foundPosition ? foundPosition.id : 0;
      });

      console.log("Posición mapeada:", mappedPositions);
      return {
        name: initialData.name || "",
        nickname: initialData.nickname || "",
        photoUrl: initialData.photoUrl || "",
        preferredFoot: (initialData.preferredFoot || "Right") as
          | "Left"
          | "Right",
        positions: mappedPositions,
        age: initialData.age?.toString() || "",
        height: initialData.height?.toString() || "",
      };
    }

    // Para crear un nuevo jugador.
    return {
      name: "",
      nickname: "",
      photoUrl: "",
      preferredFoot: "Right",
      positions: [],
      age: "",
      height: "",
    };
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (posId: number) => {
    setFormData((prev) => {
      const prevSelected = prev.positions.includes(posId);

      const newSelected = prevSelected
        ? prev.positions.filter((id) => id !== posId)
        : [...prev.positions, posId];

      return { ...prev, positions: newSelected };
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const createPayload: PlayerCreateDTO = {
          name: formData.name,
          nickname: formData.nickname,
          photoUrl: formData.photoUrl,
          preferredFoot: formData.preferredFoot,
          positions: formData.positions,
          age: parseInt(formData.age, 10) || 0,
          height: parseInt(formData.height, 10) || 0,
        };

        const response = await fetch(`${BASE_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        });

        console.log("Respuesta del servidor:", response);
        if (response.ok) router.push("/players");
      } else {
        const updatePayload: PlayerUpdateDTO = {
          name: formData.name,
          nickname: formData.nickname,
          photoUrl: formData.photoUrl,
          preferredFoot: formData.preferredFoot,
          positions: formData.positions,
        };

        const response = await fetch(`${BASE_URL}/${initialData?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (response.ok) router.push("/players");
      }
    } catch (error) {
      console.error("Error al procesar el jugador:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800"
    >
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase">
          Nombre Completo
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm mt-1 focus:outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-400 uppercase">
          Apodo
        </label>
        <input
          type="text"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm mt-1 focus:outline-none focus:border-emerald-500"
          required
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-400 uppercase">
          Pie Fuerte
        </label>
        <select
          name="preferredFoot"
          value={formData.preferredFoot}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm mt-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
          required
        >
          <option value="Right">Derecho (Right)</option>
          <option value="Left">Izquierdo (Left)</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Posiciones del Jugador (Selecciona una o varias)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AVAILABLE_POSITIONS.map((pos) => {
            const isSelected = formData.positions.includes(pos.id);

            return (
              <button
                key={pos.id}
                type="button"
                onClick={() => handlePositionChange(pos.id)}
                className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all text-center uppercase tracking-wide
                  ${
                    isSelected
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
              >
                {pos.label} {isSelected && "✓"}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "create" && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/60 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Edad
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm mt-1 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Estatura (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm mt-1 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-slate-950 font-black py-3 rounded-xl transition-all text-sm uppercase tracking-wider"
      >
        {isSubmitting
          ? "Procesando..."
          : mode === "create"
            ? "⚽ Registrar Jugador"
            : "💾 Guardar Cambios"}
      </button>
    </form>
  );
}
