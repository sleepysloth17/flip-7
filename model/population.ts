import { Game } from "./games";
import { Individual } from "./individual";

type FitnessWrapper = {
  individual: Individual;
  fitness: number;
};

export class Population {
  private static readonly GAMES: number = 100;

  private static readonly PLAYERS_PER_GAME: number = 4;

  public static initialise(size: number): Population {
    return new Population(
      new Array(size * Population.PLAYERS_PER_GAME)
        .fill(null)
        .map((_: null, index: number) => Individual.generate(index))
    );
  }

  public get members(): Individual[] {
    return this._members.map(({ individual }) => individual);
  }

  private _members: FitnessWrapper[];

  constructor(individuals: Individual[]) {
    this._members = this._sortbyFitness(individuals);
  }

  // TODO - do I want them to play the same people G times, or reshuffle everytime
  private _sortbyFitness(individuals: Individual[]): FitnessWrapper[] {
    const fitnessMap: Record<number, number> = individuals.reduce(
      (returnMap: Record<number, number>, current: Individual) => {
        returnMap[current.id] = 0;
        return returnMap;
      },
      {}
    );

    const toProcess: Individual[] = [...individuals];

    while (toProcess.length) {
      const playerGroup: Individual[] = [];
      for (let i = 0; i < Population.PLAYERS_PER_GAME; i++) {
        const index: number = Math.floor(Math.random() * toProcess.length);
        playerGroup.push(toProcess.splice(index, 1)[0]);
      }

      for (let i = 0; i < Population.GAMES; i++) {
        const roundWinner: Individual | null = Game.create(playerGroup).play();
        if (roundWinner) {
          fitnessMap[roundWinner.id] += 1;
        }
      }
    }

    return individuals
      .map((individual: Individual) => {
        const fitness: number = fitnessMap[individual.id];
        return {
          individual,
          fitness,
        };
      })
      .sort((a: FitnessWrapper, b: FitnessWrapper) => b.fitness - a.fitness);
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
      .map(({ individual }, index: number) => individual.changeId(index));

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
      newPopulation.push(individual1.mate(this._members.length, individual2));
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
