import { Individual } from "./individual";

type FitnessWrapper = {
  individual: Individual;
  fitness: number;
};

export class Population {
  private static readonly GAMES: number = 100;
  private static readonly GOAL: number = 200;

  // it looks like, if you aim for ~21pts a hand you win in 10-11 turns, so have picked this off the back of that
  private static readonly MAX_TURNS_IN_GAME: number = 40;

  public static initialise(size: number): Population {
    return new Population(
      new Array(size).fill(null).map(() => Individual.generate())
    );
  }

  public get members(): Individual[] {
    return this._members.map(({ individual }) => individual);
  }

  private _members: FitnessWrapper[];

  constructor(individuals: Individual[]) {
    this._members = this._sortbyFitness(individuals);
  }

  private _sortbyFitness(individuals: Individual[]): FitnessWrapper[] {
    return individuals
      .map((individual: Individual) => {
        const fitness: number = this._calculateFitness(individual);
        return {
          individual,
          fitness,
        };
      })
      .sort((a: FitnessWrapper, b: FitnessWrapper) => a.fitness - b.fitness);
  }

  // split into groups of N
  // play 1 game
  // return total turns in teh fitness thing
  // repeat GAMES times
  // then at the end, divide the turns by games to get fitness
  // I guess fitness can basically be "did they win against the other ones"
  // more wins = better
  private _calculateFitness(individual: Individual): number {
    let totalTurns: number = 0;
    for (let i = 0; i < Population.GAMES; i++) {
      totalTurns += this._getTurnsForGame(individual);

      if (totalTurns === Infinity) {
        return Infinity;
      }
    }

    return totalTurns / Population.GAMES;
  }

  private _getTurnsForGame(individual: Individual): number {
    let turns: number = 0;
    let total: number = 0;

    while (total < Population.GOAL) {
      if (turns > Population.MAX_TURNS_IN_GAME) {
        return Infinity; // taken too long, not worth continuing
      }

      total += this._playUntilStop(individual);
      turns++;
    }

    return turns;
  }

  private _playUntilStop(individual: Individual): number {
    const deck: number[] = new Array(12)
      .fill(null)
      .flatMap((_: null, i: number) => new Array(i + 1).fill(i + 1));

    let total: number = 0;
    let taken: Set<number> = new Set();

    const take: () => number = () => {
      const index: number = Math.floor(Math.random() * deck.length);
      return deck.splice(index, 1)[0];
    };

    while (deck.length && taken.size < 7 && !individual.stop(total, taken)) {
      const num: number = take();

      if (taken.has(num)) {
        return 0;
      }

      total += num;
      taken.add(num);
    }

    return total + (taken.size === 7 ? 15 : 0);
  }

  // TODO - can I work out a better way to do this?
  public converged(): boolean {
    return this._members.every(({ individual }) =>
      individual.equals(this._members[0].individual)
    );
  }

  /**
   * Process:
   * a) Select parents from population
   * b) Crossover and generate new population
   * c) Perform mutation on new population
   * d) Calculate fitness for new population
   */
  public evolve(): Population {
    // TODO - to pick, do I do the number line thing with (1 / fitness) ^ 2 ? OR do I just pick the first like, 10% as here? to send to the new one?
    const newPopulation: Individual[] = this._members
      .slice(0, Math.floor(this._members.length / 10))
      .map(({ individual }) => individual);

    while (newPopulation.length < this._members.length) {
      // TODO - currentl pick from top 50% to mate, should it be better?
      const individual1: Individual =
        this._members[
          Math.floor(Math.random() * Math.floor(this._members.length / 2))
        ].individual;
      const individual2: Individual =
        this._members[
          Math.floor(Math.random() * Math.floor(this._members.length / 2))
        ].individual;
      newPopulation.push(individual1.crossover(individual2));
    }

    newPopulation.forEach((individual: Individual) => individual.mutate());

    return new Population(newPopulation);
  }

  public printTopN(n: number): void {
    console.log(
      this._members
        .slice(0, n)
        .map((f: FitnessWrapper) => [f.fitness, f.individual.geneString])
    );
  }
}
