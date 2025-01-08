import { environment } from "../../environment";
import { Individual } from "../individual";
import { Deck, Card, CardType } from "./deck";
import { GameState, RoundState, PlayerRoundState } from "./state";

export class Game {
  public static create(individuals: Individual[]): Game {
    return new Game(individuals, Deck.create());
  }

  constructor(private _individuals: Individual[], private _deck: Deck) {}

  // play the game and return the winner
  public play(): Individual | null {
    let winner: { individual: Individual; score: number } | null = null;
    let gameState: GameState = {
      scores: this._individuals.reduce(
        (returnMap: Record<string, number>, current: Individual) => {
          returnMap[current.id] = 0;
          return returnMap;
        },
        {}
      ),
    };
    let rounds: number = 0;

    while (!winner) {
      const roundState: RoundState = this._round(gameState, [
        ...this._individuals,
      ]);
      Object.keys(roundState.playerRoundStates).forEach((key: string) => {
        gameState.scores[key] += roundState.playerRoundStates[key].total;
      });

      for (const individual of this._individuals) {
        if (gameState.scores[individual.id] >= environment.goal) {
          winner =
            !winner || winner.score < gameState.scores[individual.id]
              ? { individual, score: gameState.scores[individual.id] }
              : winner;
        }
      }

      rounds++;

      if (rounds > environment.maxRoundsPerGame) {
        return null; // everyone is bad, we should really stop
      }
    }

    return winner.individual;
  }

  // goes until one player has 7, or everyone is out or has stopped
  private _round(
    gameState: GameState,
    playersInRound: Individual[]
  ): RoundState {
    const roundState: RoundState = {
      numCardsLeftInDeck: this._deck.size,
      playerRoundStates: playersInRound.reduce(
        (returnMap: Record<string, PlayerRoundState>, current: Individual) => {
          returnMap[current.id] = {
            total: 0,
            taken: new Set(),
          };
          return returnMap;
        },
        {}
      ),
    };

    while (playersInRound.length) {
      for (let i = 0; i < playersInRound.length; i++) {
        if (this._deck.isEmpty()) {
          this._deck.reshuffle();
        }

        const individual: Individual = playersInRound[i];
        const playerRoundState: PlayerRoundState =
          roundState.playerRoundStates[individual.id];

        if (individual.stop(gameState, roundState)) {
          playersInRound.splice(0, 1);
          i--;
        } else {
          const card: Card = this._deck.draw();

          if (
            card.type === CardType.NUMBER &&
            playerRoundState.taken.has(card.value)
          ) {
            playerRoundState.total = 0;
            playerRoundState.taken = new Set();
            playersInRound.splice(0, 1);
            i--;
          } else {
            if (card.type === CardType.NUMBER) {
              playerRoundState.taken.add(card.value);
            }
            playerRoundState.total += card.value;

            if (playerRoundState.taken.size === environment.maxNumberOfCards) {
              playerRoundState.total += 15;
              return roundState;
            }
          }
        }

        roundState.numCardsLeftInDeck = this._deck.size;
      }
    }

    return roundState;
  }
}
