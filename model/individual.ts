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

  // TODO -  could genes be a map from type to gene? that way we don't neccessarily need all genes
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
  // TODO - add strategy gene to work out if we continue until no continues, or stop on single stop etc?
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
