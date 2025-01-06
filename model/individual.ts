import {
  MaxTotalGene,
  MaxRiskGene,
  CurrentNumberCards,
  Gene,
  GeneType,
  Decision,
} from "./gene";

export class Individual {
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
    return Object.values(this._genes)
      .map((gene: Gene) => gene.toString())
      .join(" ");
  }

  private _genes: Record<GeneType, Gene>;

  // TODO -  could genes be a map from type to gene? that way we don't neccessarily need all genes
  constructor(geneList: Gene[]) {
    this._genes = geneList.reduce(
      (returnMap: Record<GeneType, Gene>, current: Gene) => {
        returnMap[current.type] = current;
        return returnMap;
      },
      {} as Record<GeneType, Gene>
    );
  }

  public crossover(other: Individual): Individual {
    const newGenes: Gene[] = [];
    for (const gene of Object.values(this._genes)) {
      if (Math.random() < Individual.CROSSOVER_CHANCE) {
        newGenes.push(other._genes[gene.type]);
      } else {
        newGenes.push(gene);
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
    const decisions: Record<Decision, number> = Object.values(this._genes)
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
    return Object.values(this._genes).every((gene: Gene, index: number) =>
      gene.equals(other._genes[gene.type])
    );
  }
}
