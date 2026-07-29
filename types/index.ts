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
  avgDefending: number;
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
  isFreeKick: boolean;
  assistedByPlayerId: number;
  assistedByPlayerName: string;
  matchDate: string;
}

export interface MatchReadDTO {
  id: number;
  matchDate: string;
  location: string;
  teamAScore: number;
  teamBScore: number;
  status: string;
  matchDetails: MatchDetailReadDto[];
  goals: GoalReadDTO[];
}

export interface MatchDetailCreateDto {
  playerId: number;
  team: 0 | 1; // 0 = Equipo A, 1 = Equipo B
}

export interface MatchUpdateDTO {
  matchDate: string;
  location: string;
}

export interface MatchSaveDTO extends MatchUpdateDTO {
  matchDetails: {
    playerId: number;
    team: 0 | 1;
  }[];
}

export interface PlayerStatUpdateInput {
  playerId: number;
  playerName?: string;
  team: 0 | 1;
  recoveries: number;
  tackles: number;
  foulsCommitted: number;
}

export interface MatchStatsUpdateDTO {
  playersStats: PlayerStatUpdateInput[];
}

export interface GoalCreateDTO extends GoalUpdateDTO {
  matchId: number;
}

export interface GoalUpdateDTO {
  minute: number;
  playerId: number;
  isPenalty: boolean;
  isFreeKick: boolean;
  assistedByPlayerId: number;
}

export interface RatingUpdateDTO {
  goalkeeping: number;
  strength: number;
  physicality: number;
  defending: number;
  dribbling: number;
  passing: number;
  shooting: number;
  speed: number;
}

export interface RatingCreateDTO extends RatingUpdateDTO {
  playerId: number;
}

export interface RatingReadDTO extends RatingCreateDTO {
  id: number;
  playerName: string;
  userId: number;
  userName?: string;
  createdAt: string;
  overallRating: number;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Tipos para las formaciones
export interface PositionCoordinate {
  id: string; // Identificador de la posición (ej: 'PO', 'DFC', 'DC')
  label: string; // Etiqueta legible (ej: 'PO', 'DF', 'MC')
  top: string; // Porcentaje de distancia desde arriba (base para Equipo A)
  left: string; // Porcentaje de distancia desde la izquierda
}

export type FormationPreset = Record<string, PositionCoordinate[]>;

// formaciones predefinidas por número de jugadores
// 8 v 8
export const FORMATIONS_PRESETS: Record<number, FormationPreset> = {
  // 8 v 8
  8: {
    "3-3-1": [
      { id: "PO", label: "PO", top: "92%", left: "50%" },
      { id: "DFI", label: "DFI", top: "68%", left: "20%" },
      { id: "DFC", label: "DFC", top: "68%", left: "50%" },
      { id: "DFD", label: "DFD", top: "68%", left: "80%" },
      { id: "MCI", label: "MCI", top: "42%", left: "25%" },
      { id: "MCC", label: "MCC", top: "42%", left: "50%" },
      { id: "MCD", label: "MCD", top: "42%", left: "75%" },
      { id: "DC", label: "DC", top: "16%", left: "50%" },
    ],
    "3-2-2": [
      { id: "PO", label: "PO", top: "92%", left: "50%" },
      { id: "DFI", label: "DFI", top: "68%", left: "20%" },
      { id: "DFC", label: "DFC", top: "68%", left: "50%" },
      { id: "DFD", label: "DFD", top: "68%", left: "80%" },
      { id: "MCI", label: "MC", top: "42%", left: "35%" },
      { id: "MCD", label: "MC", top: "42%", left: "65%" },
      { id: "DCI", label: "DC", top: "16%", left: "35%" },
      { id: "DCD", label: "DC", top: "16%", left: "65%" },
    ],
    "3-2-1-1": [
      { id: "PO", label: "PO", top: "92%", left: "50%" },
      { id: "DFI", label: "DFI", top: "68%", left: "20%" },
      { id: "DFC", label: "DFC", top: "68%", left: "50%" },
      { id: "DFD", label: "DFD", top: "68%", left: "80%" },
      { id: "MCI", label: "MC", top: "46%", left: "35%" },
      { id: "MCD", label: "MC", top: "46%", left: "65%" },
      { id: "MO", label: "MP", top: "28%", left: "50%" },
      { id: "DC", label: "DC", top: "12%", left: "50%" },
    ],
  },

  // 9 v 9
  9: {
    "3-3-2": [
      { id: "PO", label: "PO", top: "92%", left: "50%" },
      { id: "DFI", label: "DFC", top: "68%", left: "22%" },
      { id: "DFC", label: "DFC", top: "68%", left: "50%" },
      { id: "DFD", label: "DFC", top: "68%", left: "78%" },
      { id: "MCI", label: "MC", top: "42%", left: "25%" },
      { id: "MCC", label: "MC", top: "42%", left: "50%" },
      { id: "MCD", label: "MC", top: "42%", left: "75%" },
      { id: "DCI", label: "DC", top: "16%", left: "35%" },
      { id: "DCD", label: "DC", top: "16%", left: "65%" },
    ],
    "4-3-1": [
      { id: "PO", label: "PO", top: "92%", left: "50%" },
      { id: "LI", label: "LI", top: "66%", left: "15%" },
      { id: "DFI", label: "DFC", top: "68%", left: "38%" },
      { id: "DFD", label: "DFC", top: "68%", left: "62%" },
      { id: "LD", label: "LD", top: "66%", left: "85%" },
      { id: "MCI", label: "MC", top: "42%", left: "25%" },
      { id: "MCC", label: "MC", top: "42%", left: "50%" },
      { id: "MCD", label: "MC", top: "42%", left: "75%" },
      { id: "DC", label: "DC", top: "16%", left: "50%" },
    ],
    "3-4-1": [
      { id: "PO", label: "PO", top: "92%", left: "50%" },
      { id: "DFI", label: "DFC", top: "68%", left: "22%" },
      { id: "DFC", label: "DFC", top: "68%", left: "50%" },
      { id: "DFD", label: "DFC", top: "68%", left: "78%" },
      { id: "MI", label: "MI", top: "42%", left: "15%" },
      { id: "MCI", label: "MC", top: "44%", left: "38%" },
      { id: "MCD", label: "MC", top: "44%", left: "62%" },
      { id: "MD", label: "MD", top: "42%", left: "85%" },
      { id: "DC", label: "DC", top: "16%", left: "50%" },
    ],
    "3-2-3-1": [
      { id: "PO", label: "PO", top: "92%", left: "50%" },
      { id: "DFI", label: "DFC", top: "68%", left: "22%" },
      { id: "DFC", label: "DFC", top: "68%", left: "50%" },
      { id: "DFD", label: "DFC", top: "68%", left: "78%" },
      { id: "MCD1", label: "MC", top: "50%", left: "38%" },
      { id: "MCD2", label: "MC", top: "50%", left: "62%" },
      { id: "EI", label: "EI", top: "28%", left: "20%" },
      { id: "MO", label: "MP", top: "30%", left: "50%" },
      { id: "ED", label: "ED", top: "28%", left: "80%" },
      { id: "DC", label: "DC", top: "12%", left: "50%" },
    ],
    "3-2-1-2": [
      { id: "PO", label: "PO", top: "92%", left: "50%" },
      { id: "DFI", label: "DFC", top: "68%", left: "22%" },
      { id: "DFC", label: "DFC", top: "68%", left: "50%" },
      { id: "DFD", label: "DFC", top: "68%", left: "78%" },
      { id: "MCD1", label: "MC", top: "48%", left: "38%" },
      { id: "MCD2", label: "MC", top: "48%", left: "62%" },
      { id: "MO", label: "MP", top: "30%", left: "50%" },
      { id: "DCI", label: "DC", top: "14%", left: "35%" },
      { id: "DCD", label: "DC", top: "14%", left: "65%" },
    ],
  },
  // 10 v 10
  10: {
    "4-3-2": [
      { id: "PO", label: "PO", top: "88%", left: "50%" },
      { id: "LI", label: "LI", top: "70%", left: "15%" },
      { id: "DFI", label: "DFC", top: "72%", left: "38%" },
      { id: "DFD", label: "DFC", top: "72%", left: "62%" },
      { id: "LD", label: "LD", top: "70%", left: "85%" },
      { id: "MCI", label: "MC", top: "48%", left: "25%" },
      { id: "MCC", label: "MC", top: "50%", left: "50%" },
      { id: "MCD", label: "MC", top: "48%", left: "75%" },
      { id: "DCI", label: "DC", top: "22%", left: "35%" },
      { id: "DCD", label: "DC", top: "22%", left: "65%" },
    ],
    "3-4-2": [
      { id: "PO", label: "PO", top: "88%", left: "50%" },
      { id: "DFI", label: "DFC", top: "72%", left: "25%" },
      { id: "DFC", label: "DFC", top: "74%", left: "50%" },
      { id: "DFD", label: "DFC", top: "72%", left: "75%" },
      { id: "MI", label: "MI", top: "48%", left: "15%" },
      { id: "MCI", label: "MC", top: "50%", left: "38%" },
      { id: "MCD", label: "MC", top: "50%", left: "62%" },
      { id: "MD", label: "MD", top: "48%", left: "85%" },
      { id: "DCI", label: "DC", top: "22%", left: "35%" },
      { id: "DCD", label: "DC", top: "22%", left: "65%" },
    ],
  },

  // 11 v 11
  11: {
    "4-3-3": [
      { id: "PO", label: "PO", top: "88%", left: "50%" },
      { id: "LI", label: "LI", top: "70%", left: "15%" },
      { id: "DFI", label: "DFC", top: "72%", left: "38%" },
      { id: "DFD", label: "DFC", top: "72%", left: "62%" },
      { id: "LD", label: "LD", top: "70%", left: "85%" },
      { id: "MCI", label: "MC", top: "48%", left: "28%" },
      { id: "MCC", label: "MC", top: "52%", left: "50%" },
      { id: "MCD", label: "MC", top: "48%", left: "72%" },
      { id: "EI", label: "EI", top: "22%", left: "20%" },
      { id: "DC", label: "DC", top: "20%", left: "50%" },
      { id: "ED", label: "ED", top: "22%", left: "80%" },
    ],
    "4-4-2": [
      { id: "PO", label: "PO", top: "88%", left: "50%" },
      { id: "LI", label: "LI", top: "70%", left: "15%" },
      { id: "DFI", label: "DFC", top: "72%", left: "38%" },
      { id: "DFD", label: "DFC", top: "72%", left: "62%" },
      { id: "LD", label: "LD", top: "70%", left: "85%" },
      { id: "MI", label: "MI", top: "48%", left: "18%" },
      { id: "MCI", label: "MC", top: "50%", left: "38%" },
      { id: "MCD", label: "MC", top: "50%", left: "62%" },
      { id: "MD", label: "MD", top: "48%", left: "82%" },
      { id: "DCI", label: "DC", top: "22%", left: "35%" },
      { id: "DCD", label: "DC", top: "22%", left: "65%" },
    ],
  },
};
