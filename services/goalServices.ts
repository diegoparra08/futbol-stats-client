import {
  ApiResponseFormat,
  GoalCreateDTO,
  GoalReadDTO,
  GoalUpdateDTO,
} from "@/types";
import { API_BASE_URL } from "./api";

export const goalService = {
  getGoal: async (
    matchId?: number,
    playerId?: number,
    year?: number,
  ): Promise<GoalReadDTO[]> => {
    try {
      //se usan params para pasar los parametros de la URL solo si son definidos, de lo contrario se omiten
      const params = new URLSearchParams();

      if (matchId && matchId > 0) {
        params.append("matchId", matchId.toString());
      }
      if (playerId && playerId > 0) {
        params.append("playerId", playerId.toString());
      }
      if (year && year > 0) {
        params.append("year", year.toString());
      }

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/Goal${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Error al conectar con la API");
      }

      const result: ApiResponseFormat<GoalReadDTO[]> = await response.json();

      return result.data || result;
    } catch (error) {
      console.error("Error en goalService:", error);
      throw error;
    }
  },
};
