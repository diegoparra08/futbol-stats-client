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
// El DTO de tu jugador 
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
}

export interface PlayerUpdateDTO {
  name: string;
  nickname: string;
  photoUrl: string;
  preferredFoot: "Left" | "Right";
  positions: number[];
 
}

export interface PlayerCreateDTO extends PlayerUpdateDTO {
 age: number;
height: number;
}

export interface MatchDetailReadDto {
  playerId: number;
  playerName: string;
  team: string;
  recoveries: number;
  tackles: number;
  foulsCommitted: number;
}

export interface GoalReadDTO {
  id: number;
  minute: number;
  matchId: number;
  playerId: number;
  playerName: string;
  playerGoals: number;
  isPenalty: boolean;
  assistedByPlayerId: number;
  matchDate: string;
}

export interface MatchReadDTO {
  id: number,
  matchDate: string,
  location: string,
  teamAScore: number,
  teamBScore: number,
  status: string,
  matchDetails: MatchDetailReadDto[],
  goals: GoalReadDTO[]
}