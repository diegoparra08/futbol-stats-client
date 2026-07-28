"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { authService } from "@/services/authServices";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Llamada al servicio que invoca a la API Proxy /api/auth/logout
      await authService.logout();

      // Limpiar datos visuales almacenados que eran originalemete mail y nombre
      localStorage.removeItem("user_info");

      //  forzar al login
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      title="Cerrar sesión"
      aria-label="Cerrar sesión"
      className="group relative flex items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      ) : (
        <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      )}

      {/* flotante al hacer hover */}
      <span className="absolute -bottom-9 right-0 scale-0 transition-all duration-150 group-hover:scale-100 bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-md border border-slate-700 shadow-xl whitespace-nowrap pointer-events-none">
        Cerrar sesión
      </span>
    </button>
  );
}