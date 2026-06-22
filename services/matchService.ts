import { ApiResponseFormat, MatchReadDTO } from "@/types";
import { API_BASE_URL } from "./api";



export const matchService = {
  getAllMatches: async (): Promise<MatchReadDTO[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Match`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", 
      });
      if (!response.ok) {
        throw new Error("Error al conectar con la API");
      }

      const result: ApiResponseFormat<MatchReadDTO[]> = await response.json();
      
      return result.data; 
    } catch (error) {
      console.error("Error en matchService:", error);
      return [];    
    }
  },

  getMatchById: async (id: number): Promise<MatchReadDTO> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Match/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", 
      });
      if (!response.ok) {
        throw new Error("Error al conectar con la API");
      }

      const result: ApiResponseFormat<MatchReadDTO> = await response.json();
   
      return result.data; 
    } catch (error) {
      console.error("Error en matchService:", error);
      throw error;
    }
  },

  updateMatchStatus: async (id: number, status: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Match/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
        cache: "no-store", 
      });
      if (!response.ok) {
        throw new Error("Error al conectar con la API");
      }

      const result: ApiResponseFormat<boolean> = await response.json();
   
      return result.succeeded;
    } catch (error) {
      console.error("Error en matchService:", error);
      throw error;
    }
  },
};