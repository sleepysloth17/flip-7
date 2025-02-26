import { environment } from "../environment";
import { shuffle } from "../util/array";
import { Game } from "./game/game";
import { Individual } from "./individual";

type FitnessWrapper = {
  individual: Individual;
  fitness: number;
};

export class Population {
  public static initialise(size: number): Population {
    return new Population(
      new Array(size * environment.playersPerGame)
        .fill(null)
        .map((_: null, index: number) => Individual.generate())
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
    const fitnessMap: Record<string, number> = individuals.reduce(
      (returnMap: Record<string, number>, current: Individual) => {
        returnMap[current.id] = 0;
        return returnMap;
      },
      {}
    );

    // I reshuffle ever game as I figure if one individual wins one game in a group, it probably will win a whole bunch more
    // this feels like it would be more useful to keep trying each individual against new groups
    // it is slower though
    for (let i = 0; i < environment.gamesPerFitnessCalculation; i++) {
      shuffle(individuals);
      let start: number = 0;

      while (start < individuals.length) {
        const playerGroup: Individual[] = [];
        for (let i = 0; i < environment.playersPerGame; i++) {
          playerGroup.push(individuals[start]);
          start++;
        }

        // do I want to take into account how quickly they won?
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
      newPopulation.push(individual1.mate(individual2));
    }

    newPopulation.forEach((individual: Individual) => individual.mutate());

    return new Population(newPopulation);
  }

  public printTopN(n?: number): void {
    console.log(
      ...this._members
        .slice(0, n || this._members.length)
        .map((f: FitnessWrapper) => [f.fitness, f.individual.geneString])
    );
  }
}
