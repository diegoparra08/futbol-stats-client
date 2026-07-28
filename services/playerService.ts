// services/playerService.ts
import { ApiResponseFormat, PlayerReadDTO, PlayerStatsReadDTO } from "@/types";
import { API_BASE_URL } from "./api";


export const playerService = {
  getAllPlayers: async (includeInactive: boolean = false): Promise<PlayerReadDTO[]> => {
    try {
      // 
      const response = await fetch(`${API_BASE_URL}/api/Player?includeInactive=${includeInactive}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", 
      });
      if (!response.ok) {
        throw new Error("Error al conectar con la API de .NET");
      }

      const result: ApiResponseFormat<PlayerReadDTO[]> = await response.json();
  
      return result.data; 
    } catch (error) {
      console.error("Error en playerService:", error);
      return []; 
    }
  },

  getById: async (id: number): Promise<PlayerReadDTO | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Player/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", 
      });
      if (!response.ok) {
        throw new Error("Error al conectar con la API");
      }

      const result: ApiResponseFormat<PlayerReadDTO> = await response.json();

      return result.data || null;
    } catch (error) {
      console.error("Error en playerService:", error);
      throw error;
    }
  },

  getPlayerStats: async (id: number): Promise<PlayerStatsReadDTO> => {
    const response = await fetch(`${API_BASE_URL}/api/Player/${id}/stats`);
    if (!response.ok) {
      throw new Error("No se pudieron cargar las estadísticas");
    }

    const result: ApiResponseFormat<PlayerStatsReadDTO> = await response.json();
    return result.data;
  },

  changePlayerStatus: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Player/${id}/change-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", 
    });
      if (!response.ok) {
        throw new Error("No se pudo cambiar el estado del jugador");
      }

      const result: ApiResponseFormat<object> = await response.json(); //Se pasa object para que permita recibir el tipo de objeto dentro de la promesa ademas es lo que retorna la resp del back
      return result.succeeded;
    }
    catch (error){
      console.error("Error en playerService:", error);
      throw error;
    }
  }
  
};

