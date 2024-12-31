export interface FinalResults {
  type: 'FinalResults';
  gameId: string;
  players: PlayerFinalResults[];
}

export interface PlayerFinalResults {
  playerName: string;
  playerColor: string;
  totalScore: number;
}
