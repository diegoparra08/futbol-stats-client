import {
  ApiResponseFormat,
  RatingCreateDTO,
  RatingReadDTO,
  RatingUpdateDTO,
} from "@/types";


export const ratingService = {
  getAllPlayerRatings: async (playerId: number): Promise<RatingReadDTO[]> => {
    try {
      const response = await fetch(
        `/api/ratings/player/${playerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
        `/api/ratings/player/${playerId}/own`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
    const response = await fetch(`/api/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      try {
      
        const errorJson = await response.json();
        if (errorJson && errorJson.message) {
          throw new Error(errorJson.message);
        }
      } catch (parseError: unknown) {
        
        if (parseError instanceof Error && parseError.message !== "Unexpected token...") {
          throw parseError;
        }
      }
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
      const response = await fetch(`/api/ratings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
