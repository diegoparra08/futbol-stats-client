// types/index.ts

// El formato estandar de respuestas de la API cuando trae datos viene el data cuando no viene vacio.
export interface ApiResponseFormat<T> {
  data: T;
  message: string;
  succeeded: boolean;
}

export interface PlayerStatsReadDTO {
    playerId: number;
    matchesPlayed: number;
    goals: number;
    assists: number;
}
// El DTO de tu jugador (pon los campos exactos que tienes en tu backend)
export interface PlayerReadDTO {
  id: number;
  name: string;
  nickname: string;
  photoUrl: string;
  preferredFoot: "Left" | "Right";
  overallRating: number;
  age: number;
  height: number;
  isActive: boolean;
  positions: string[];
  avgSpeed: number;
  avgShooting: number;
  avgPassing: number;
  avgDribbling: number;
  avgDefending  : number;
  avgPhysicality: number;
  avgStrength: number;
  avgGoalkeeping: number;
  // Puedes agregar aquí más adelante: position, rating, etc.
}

