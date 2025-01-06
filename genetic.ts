// class Gene {
//   constructor(
//     private val: number; // the val to use in the handler
//   use: boolean; // true if we actually use this gene, to see which make a difference
//   stop: (total: number, taken: Set<number>) => boolean; // true if stop, else false
//   ) {}
// };

// shoudl this have like DEFINITE STOP, DEFINITE CONTINUE, then like VOTE STOP etc?
// should the responses be random as well?
enum Decision {
  STOP,
  CONTINUE,
  DELEGATE,
}

abstract class Gene {
  protected abstract readonly _name: string;

  constructor(
    // TODO = abstract val?
    protected _val: number, // the val to use in the handler
    protected _use: boolean // true if we actually use this gene, to see which make a difference
  ) {}

  // true if stop, else false
  public stop(total: number, taken: Set<number>): Decision {
    if (this._use) {
      return this.stopHandler(total, taken);
    } else {
      return Decision.DELEGATE;
    }
  }

  protected abstract stopHandler(total: number, taken: Set<number>): Decision;

  public equals(other: Gene): boolean {
    // TODO - check type and that
    if (this._use) {
      return this._val === other._val && this._use === other._use;
    } else {
      return !other._use;
    }
  }

  public toString(): string {
    return `{name: ${this._name}, val: ${this._val}, use: ${this._use}}`;
  }
}

class MaxTotalGene extends Gene {
  protected readonly _name: string = "max-total";
  public stopHandler(total: number, taken: Set<number>): Decision {
    return total > this._val ? Decision.STOP : Decision.DELEGATE;
  }
}

class MaxRiskGene extends Gene {
  private static TOTAL_CARDS_IN_DECK: number = 78;

  protected readonly _name: string = "max-risk";
  // TODO - I'm not sure this is correct tbh, it aligns with max total, I need to do the maths and see if it should be simplified this much
  // do some maths bby
  public stopHandler(total: number, taken: Set<number>): Decision {
    const remaining: number = [...taken].reduce((a, b) => a + b, -taken.size);

    return remaining / (MaxRiskGene.TOTAL_CARDS_IN_DECK - taken.size) >
      this._val
      ? Decision.STOP
      : Decision.DELEGATE;
  }
}

// TODO - should this be included with other ones or something? I feel it should be an and
// e.g, risk and this seeem similar right?
// currentlt his is useless
// should it be a range, so always conitue if greater than 5 cards, elkse ignore this etc?
// would mean these can't just say when to STOP but also when to CONTINUE
// so I guess rather than returning a boolean, return an enum of STOP, CONTINUE, DELEGATE_TO_OTHER
class CurrentNumberCards extends Gene {
  protected readonly _name: string = "card-count";
  public stopHandler(total: number, taken: Set<number>): Decision {
    return taken.size > this._val ? Decision.CONTINUE : Decision.DELEGATE;
  }
}

class Individual {
  private static readonly MAX_POSSIBLE_ROUND_SCORE: number = 78;
  private static readonly MAX_POSSIBLE_RISK: number = 78;
  private static readonly MAX_POSSIBLE_NUMBER_OF_CARDS = 7;

  private static readonly MUTATION_CHANCE: number = 0.3;
  private static readonly CROSSOVER_CHANCE: number = 0.4;

  public static generate(): Individual {
    return new Individual([
      new MaxTotalGene(
        Math.floor(Math.random() * (Individual.MAX_POSSIBLE_ROUND_SCORE + 1)),
        Math.random() < 0.5
      ),
      new MaxRiskGene(
        Math.round(Math.random() * 100) / 100,
        Math.random() < 0.5
      ),
      new CurrentNumberCards(
        Math.floor(Math.random() * Individual.MAX_POSSIBLE_NUMBER_OF_CARDS),
        Math.random() < 0.5
      ),
    ]);
  }

  public get geneString(): string {
    return this._genes.map((gene: Gene) => gene.toString()).join(" ");
  }

  constructor(private _genes: Gene[]) {}

  public crossover(other: Individual): Individual {
    const newGenes: Gene[] = [];
    for (let i = 0; i < this._genes.length; i++) {
      if (Math.random() < Individual.CROSSOVER_CHANCE) {
        newGenes.push(other._genes[i]);
      } else {
        newGenes.push(this._genes[i]);
      }
    }

    return new Individual(newGenes);
  }

  public mutate(): Individual {
    if (Math.random() < Individual.MUTATION_CHANCE) {
      return Individual.generate();
    }

    return this;
  }

  // check if any of the genes say to stop
  // TODO - do I need to randomise if it's an and or an or?
  public stop(total: number, taken: Set<number>): boolean {
    const decisions: Record<Decision, number> = this._genes
      .map((gene: Gene) => gene.stop(total, taken))
      .reduce((returnMap: Record<Decision, number>, current: Decision) => {
        returnMap[current] = (returnMap[current] || 0) + 1;
        return returnMap;
      }, {} as Record<Decision, number>);
    // TODO - work this out, should CONTINUE just make it contiue, then check stop, then continue otherwise?
    return !decisions[Decision.CONTINUE] ? !!decisions[Decision.STOP] : false;
    return (
      !!decisions[Decision.STOP] &&
      decisions[Decision.STOP] > (decisions[Decision.CONTINUE] || 0)
    );
  }

  // check all genes are equal
  public equals(other: Individual): boolean {
    return this._genes.every((gene: Gene, index: number) =>
      gene.equals(other._genes[index])
    );
  }
}

type FitnessWrapper = {
  individual: Individual;
  fitness: number;
};

class Population {
  private static readonly GAMES: number = 100;
  private static readonly GOAL: number = 200;

  // TODO - test this, I've done it arbitrarily to stop it from getting stuck on a terribl individual
  // from basic tests of max, looks like you want to aim for under like, 11 which is the best I get
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
      if (turns > Population.MAX_TURNS_IN_GAME) {
        return Infinity;
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

  public printTopN(n: number): void {
    console.log(
      this._members
        .slice(0, n)
        .map((f: FitnessWrapper) => [f.fitness, f.individual.geneString])
    );
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
    population.printTopN(5);
    population = population.evolve();
  }
  console.log("-".repeat(process.stdout.columns));
  population.printTopN(20);
  return population.members;
};

run(1000);
