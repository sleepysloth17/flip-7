import { environment } from "../environment";
import { Gene, GeneType } from "./gene/gene";
import { GeneFactory } from "./gene/gene-factory";
import { strategyHandler } from "./strategy";

export class Individual {
  public static generate(id?: string): Individual {
    return new Individual(
      id || crypto.randomUUID(),
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

  constructor(public readonly id: string, geneList: Gene[]) {
    this._genes = geneList.reduce(
      (returnMap: Record<GeneType, Gene>, current: Gene) => {
        returnMap[current.type] = current;
        return returnMap;
      },
      {} as Record<GeneType, Gene>
    );
  }

  public mate(other: Individual): Individual {
    const newGenes: Gene[] = [];
    for (const gene of Object.values(this._genes)) {
      if (Math.random() < environment.crossoverChance) {
        newGenes.push(other._genes[gene.type]);
      } else {
        newGenes.push(gene);
      }
    }

    return new Individual(crypto.randomUUID(), newGenes);
  }

  // TODO - could be better
  public mutate(): Individual {
    const newGenes: Gene[] = [];
    for (const gene of Object.values(this._genes)) {
      if (Math.random() < environment.mutationChance) {
        newGenes.push(GeneFactory.generate(gene.type));
      } else {
        newGenes.push(gene);
      }
    }

    return new Individual(this.id, newGenes);
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
