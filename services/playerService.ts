// services/playerService.ts
import { ApiResponseFormat, PlayerReadDTO, PlayerStatsReadDTO } from "@/types";
import { API_BASE_URL } from "./api";


export const playerService = {
  getAllPlayers: async (includeInactive: boolean = false): Promise<PlayerReadDTO[]> => {
    try {
      // 2. Apuntamos a /Player (en singular, respetando tu controlador de C#)
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

  getPlayerStats: async (id: number): Promise<PlayerStatsReadDTO> => {
    const response = await fetch(`${API_BASE_URL}/api/Player/${id}/stats`);
    if (!response.ok) {
      throw new Error("No se pudieron cargar las estadísticas");
    }

    const result: ApiResponseFormat<PlayerStatsReadDTO> = await response.json();
    return result.data;
  }
};

