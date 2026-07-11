import {
  ApiResponseFormat,
  RatingCreateDTO,
  RatingReadDTO,
  RatingUpdateDTO,
} from "@/types";
import { API_BASE_URL, getAuthHeader } from "./api";

export const ratingService = {
  getAllPlayerRatings: async (playerId: number): Promise<RatingReadDTO[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Rating/player${playerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(), //aca viaja el token extraido de la sesion del usuario
          },
          cache: "no-store",
        },
      );
      if (!response.ok) {
        throw new Error("Error al conectar con la API");
      }

      const result: ApiResponseFormat<RatingReadDTO[]> = await response.json();

      return result.data;
    } catch (error) {
      console.error("Error en ratingService:", error);
      return [];
    }
  },

  getPlayerRatingsOwn: async (playerId: number): Promise<RatingReadDTO[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Rating/player${playerId}/own`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(), //aca viaja el token extraido de la sesion del usuario
          },
          cache: "no-store",
        },
      );
      if (!response.ok) {
        throw new Error("Error al conectar con la API");
      }

      const result: ApiResponseFormat<RatingReadDTO[]> = await response.json();

      return result.data;
    } catch (error) {
      console.error("Error en ratingService:", error);
      return [];
    }
  },


createRating: async (payload: RatingCreateDTO): Promise<ApiResponseFormat<boolean>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    //si es error se inicia una valiacion para extraer el mensaje de error del api
    if (!response.ok) {
      try {
      
        const errorJson = await response.json();
        
        // extrae la propiedad message para enviar el mensaje de error
        if (errorJson && errorJson.message) {
          throw new Error(errorJson.message);
        }
      } catch (parseError: unknown) {
        
        if (parseError instanceof Error && parseError.message !== "Unexpected token...") {
          throw parseError;
        }
      }
      
      // Respaldo por si el backend llega a caer por completo sin responder JSON
      throw new Error(`Error en el servidor remoto (Código: ${response.status})`);
    }

    //respuesta de exito
    const result: ApiResponseFormat<boolean> = await response.json();
    return result;

  } catch (error) {
    throw error; 
  }
},

  updateRating: async (id: number, payload: RatingUpdateDTO): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Rating/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), //aca viaja el token extraido de la sesion del usuario
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar calificación");
      }

      const result: ApiResponseFormat<boolean> = await response.json();

      return result.succeeded;
    } catch (error) {
      console.error("Error en ratingService:", error);
      throw error;
    }
  },
};
