import { environment } from "../environment";
import { Individual } from "./individual";

type PlayerStatus = {
  total: number;
  taken: Set<number>;
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
          const draw: number = this._deck.draw();

          if (roundScore[individual.id].taken.has(draw)) {
            roundScore[individual.id] = {
              total: 0,
              taken: new Set(),
            };
            playersInRound.splice(0, 1);
            i--;
          } else {
            roundScore[individual.id].taken.add(draw);
            roundScore[individual.id].total += draw;

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
    return new Deck(
      new Array(12)
        .fill(null)
        .flatMap((_: null, i: number) => new Array(i + 1).fill(i + 1))
    );
  }

  constructor(private _deck: number[]) {}

  public reshuffle(): void {
    this._deck = new Array(12)
      .fill(null)
      .flatMap((_: null, i: number) => new Array(i + 1).fill(i + 1));
  }

  public draw(): number {
    const index: number = Math.floor(Math.random() * this._deck.length);
    return this._deck.splice(index, 1)[0];
  }

  public isEmpty(): boolean {
    return !!this._deck.length;
  }
}
