type PlayerRoundState = {
  total: number;
  taken: Set<number>;
};

type GameState = {
  scores: Record<string, number>;
};

type RoundState = {
  numCardsLeftInDeck: number;
  playerStatuses: Record<string, PlayerRoundState>;
};
