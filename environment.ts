export const environment: Readonly<Record<string, number>> = {
  // these should not be changed
  goal: 200,
  cardsInDeck: 78,
  maxNumberOfCards: 7,
  maxPossibleRoundScore: 78,
  // these can be tweeked like playing the games
  playersPerGame: 4,
  // genetic algorithm settings
  maxRoundsPerGame: 40, // it looks like, if you aim for ~21pts a hand you win in 10-11 turns, so have picked this off the back of that
  gamesPerFitnessCalculation: 100,
  populationSize: 100,
  mutationChance: 0.05,
  crossoverChance: 0.4,
};
