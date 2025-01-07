import { environment } from "../environment";
import { shuffle } from "../util/array";
import { Individual } from "./individual";

// TODO - this object should be bigger and I should be able to pass it into the stop handler
type PlayerStatus = {
  total: number;
  taken: Set<number>;
};

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

export class Game {
  public static create(individuals: Individual[]): Game {
    return new Game(individuals, Deck.create());
  }

  constructor(private _individuals: Individual[], private _deck: Deck) {}

  // play the game and return the winner
  public play(): Individual | null {
    let winner: { individual: Individual; score: number } | null = null;
    let scores: Record<string, number> = this._individuals.reduce(
      (returnMap: Record<string, number>, current: Individual) => {
        returnMap[current.id] = 0;
        return returnMap;
      },
      {}
    );
    let rounds: number = 0;

    while (!winner) {
      const roundResults: Record<string, PlayerStatus> = this._round(scores, [
        ...this._individuals,
      ]);
      Object.keys(roundResults).forEach((key: string) => {
        scores[key] += roundResults[key].total;
      });

      for (const individual of this._individuals) {
        if (scores[individual.id] >= environment.goal) {
          winner =
            !winner || winner.score < scores[individual.id]
              ? { individual, score: scores[individual.id] }
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
    scores: Record<string, number>,
    playersInRound: Individual[]
  ): Record<string, PlayerStatus> {
    const roundScore: Record<string, PlayerStatus> = playersInRound.reduce(
      (returnMap: Record<string, PlayerStatus>, current: Individual) => {
        returnMap[current.id] = {
          total: 0,
          taken: new Set(),
        };
        return returnMap;
      },
      {}
    );

    while (playersInRound.length) {
      for (let i = 0; i < playersInRound.length; i++) {
        if (this._deck.isEmpty()) {
          this._deck.reshuffle();
        }

        const individual: Individual = playersInRound[i];

        if (
          individual.stop(
            roundScore[individual.id].total,
            roundScore[individual.id].taken
          )
        ) {
          playersInRound.splice(0, 1);
          i--;
        } else {
          const card: Card = this._deck.draw();

          if (
            card.type === CardType.NUMBER &&
            roundScore[individual.id].taken.has(card.value)
          ) {
            roundScore[individual.id] = {
              total: 0,
              taken: new Set(),
            };
            playersInRound.splice(0, 1);
            i--;
          } else {
            if (card.type === CardType.NUMBER) {
              roundScore[individual.id].taken.add(card.value);
            }
            roundScore[individual.id].total += card.value;

            if (
              roundScore[individual.id].taken.size ===
              environment.maxNumberOfCards
            ) {
              roundScore[individual.id].total += 15;
              return roundScore;
            }
          }
        }

        if (
          scores[individual.id] + roundScore[individual.id].total >=
          environment.goal
        ) {
          return roundScore;
        }
      }
    }

    return roundScore;
  }
}

class Deck {
  public static create(): Deck {
    const deck: Deck = new Deck(
      new Array(12)
        .fill(null)
        .flatMap((_: null, i: number) =>
          new Array(i + 1)
            .fill(i + 1)
            .map((val: number) => new Card(CardType.NUMBER, val))
        )
        .concat(new Card(CardType.NUMBER, 0))
        .concat(
          new Card(CardType.SPECIAL_NUMBER, 2),
          new Card(CardType.SPECIAL_NUMBER, 4),
          new Card(CardType.SPECIAL_NUMBER, 6),
          new Card(CardType.SPECIAL_NUMBER, 8),
          new Card(CardType.SPECIAL_NUMBER, 10)
        )
    );
    deck.reshuffle();
    return deck;
  }

  private toDraw: number = 0;

  constructor(private _deck: Card[]) {}

  public reshuffle(): void {
    shuffle(this._deck);
    this.toDraw = 0;
  }

  // instead of all the splicing, do I want to shuffle then iterate along?
  public draw(): Card {
    return this._deck[this.toDraw++];
  }

  public isEmpty(): boolean {
    return this.toDraw === this._deck.length;
  }
}

enum CardType {
  NUMBER = "NUMBER",
  TIMES_TWO = "TIMES_TWO",
  SPECIAL_NUMBER = "SPECIAL_NUMBER",
  SECOND_CHANGE = "SECOND_CHANCE",
  FREEZE = "FREEZE",
  FLIP_THREE = "FLIP_THREE",
}

class Card {
  constructor(public readonly type: CardType, public readonly value: number) {}
}
