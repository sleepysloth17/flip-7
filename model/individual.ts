import {
  MaxTotalGene,
  MaxRiskGene,
  CurrentNumberCards,
  Gene,
  GeneType,
  Decision,
} from "./gene";
import { GeneFactory } from "./gene/gene-factory";
import { strategyHandler } from "./strategy";

export class Individual {
  private static readonly MUTATION_CHANCE: number = 0.3;
  private static readonly CROSSOVER_CHANCE: number = 0.4;

  public static generate(id: number): Individual {
    return new Individual(
      id,
      GeneFactory.generateForList([
        GeneType.MAX_TOTAL,
        GeneType.MAX_RISK,
        GeneType.MIN_CARD_COUNT,
      ])
    );
  }

  public get geneString(): string {
    return Object.values(this._genes)
      .map((gene: Gene) => gene.toString())
      .join(" ");
  }

  private readonly _genes: Record<GeneType, Gene>;

  constructor(public readonly id: number, geneList: Gene[]) {
    this._genes = geneList.reduce(
      (returnMap: Record<GeneType, Gene>, current: Gene) => {
        returnMap[current.type] = current;
        return returnMap;
      },
      {} as Record<GeneType, Gene>
    );
  }

  public changeId(id: number): Individual {
    return new Individual(id, Object.values(this._genes));
  }

  public mate(newId: number, other: Individual): Individual {
    const newGenes: Gene[] = [];
    for (const gene of Object.values(this._genes)) {
      if (Math.random() < Individual.CROSSOVER_CHANCE) {
        newGenes.push(other._genes[gene.type]);
      } else {
        newGenes.push(gene);
      }
    }

    return new Individual(newId, newGenes);
  }

  public mutate(): Individual {
    if (Math.random() < Individual.MUTATION_CHANCE) {
      return Individual.generate(this.id);
    }

    return this;
  }

  public stop(total: number, taken: Set<number>): boolean {
    return strategyHandler(total, taken, this._genes);
  }

  // check all genes are equal
  public equals(other: Individual): boolean {
    return Object.values(this._genes).every((gene: Gene) =>
      gene.equals(other._genes[gene.type])
    );
  }
}
