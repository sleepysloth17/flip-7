class Individual {
  private static readonly MAX_POSSIBLE_ROUND_SCORE: number = 78;

  private static readonly MUTATION_CHANCE: number = 0.3;
  private static readonly CROSSOVER_CHANCE: number = 0.4;

  public static generate(): Individual {
    return new Individual(
      Math.floor(Math.random() * (Individual.MAX_POSSIBLE_ROUND_SCORE + 1))
    );
  }

  // TODO - work out genes and change methods as appropriate
  constructor(private _maxTotal: number) {}

  public crossover(other: Individual): Individual {
    if (Math.random() < Individual.CROSSOVER_CHANCE) {
      return new Individual(other._maxTotal);
    }
    return this;
  }

  public mutate(): Individual {
    if (Math.random() < Individual.MUTATION_CHANCE) {
      return Individual.generate();
    }

    return this;
  }

  public stop(total: number): boolean {
    return total > this._maxTotal;
  }

  public equals(other: Individual): boolean {
    return this._maxTotal === other._maxTotal;
  }
}

type FitnessWrapper = {
  individual: Individual;
  fitness: number;
};

class Population {
  private static readonly GAMES: number = 100;

  private static readonly GOAL: number = 200;

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
    console.log(this._members.slice(0, 20));
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

  private _calculateFitness(individual: Individual): number {
    let totalTurns: number = 0;
    for (let i = 0; i < Population.GAMES; i++) {
      totalTurns += this._getTurnsForGame(individual);
    }

    return totalTurns / Population.GAMES;
  }

  private _getTurnsForGame(individual: Individual): number {
    let turns: number = 0;
    let total: number = 0;

    while (total < Population.GOAL) {
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

    while (deck.length && taken.size < 7 && !individual.stop(total)) {
      const num: number = take();

      if (taken.has(num)) {
        return 0;
      }

      total += num;
      taken.add(num);
    }

    return total + (taken.size === 7 ? 15 : 0);
  }

  public converged(): boolean {
    return this._members.every(({ individual }) =>
      individual.equals(this._members[0].individual)
    ); // TODO - work out the best way to finish
  }

  /**
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

    // TODO - do I want the size of the population to remain constant?
    while (newPopulation.length < this._members.length) {
      // TODO - currentl pick from top 50% to mate, should it be betteR?
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
}

/**
 * 1) Randomly initialize populations p
 * 2) Determine fitness of population
 * 3) Until convergence evolve
 */
const run: (size: number) => Individual[] = (size: number) => {
  let population: Population = Population.initialise(size);
  while (!population.converged()) {
    console.log("-".repeat(process.stdout.columns));
    population = population.evolve();
  }
  return population.members;
};

run(1000);
