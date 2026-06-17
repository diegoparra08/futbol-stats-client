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
      console.log(result.data);
      return result.data; 
    } catch (error) {
      console.error("Error en matchService:", error);
      return [];    
    }
  }
};