"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/authServices";

export default function AuthForm() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let response;
      if (isRegistering) {
        response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      }

      if (response.succeeded) {
        // Guardar información pública del usuario en localStorage para la UI
        if (response.user) {
          localStorage.setItem("user_info", JSON.stringify(response.user));
        }

        toast.success(
          isRegistering
            ? "¡Cuenta creada exitosamente!"
            : `¡Bienvenido, ${response.user?.name || "de nuevo"}!`,
          { duration: 3000, position: "top-center" }
        );

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 800);
      }
    } catch (error: unknown) {
      let message = "Ocurrió un error. Verifica tus datos.";
      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1e293b",
          color: "#f8fafc",
          border: "1px solid #ef4444",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
        </h1>
        <p className="text-sm text-slate-400">
          {isRegistering
            ? "Regístrate para calificar jugadores y armar tus alineaciones"
            : "Ingresa tus datos para acceder al sistema"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@correo.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-200 mt-2 ${
            isSubmitting
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20"
          }`}
        >
          {isSubmitting
            ? "Procesando..."
            : isRegistering
            ? "Registrarme"
            : "Ingresar"}
        </button>
      </form>

      {/* Botón para cambiar de modo */}
      <div className="text-center pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline font-medium transition"
        >
          {isRegistering
            ? "¿Ya tienes una cuenta? Inicia sesión aquí"
            : "¿No tienes cuenta? Regístrate aquí"}
        </button>
      </div>
    </div>
  );
}