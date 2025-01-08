export type PlayerRoundState = {
  total: number;
  taken: Set<number>;
};

export type GameState = {
  scores: Record<string, number>;
};

export type RoundState = {
  numCardsLeftInDeck: number;
  playerRoundStates: Record<string, PlayerRoundState>;
};
