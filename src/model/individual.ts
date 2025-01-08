import { environment } from "../environment";
import { Gene, GeneType } from "./gene/gene";
import { GeneFactory } from "./gene/gene-factory";
import { Strategy, StrategyType } from "./strategy";

export class Individual {
  public static generate(id?: string): Individual {
    return new Individual(
      id || crypto.randomUUID(),
      Math.random() > 0.5 ? "HARE" : "TORTOISE",
      GeneFactory.generateForList(["MAX_TOTAL", "MAX_RISK", "MIN_CARD_COUNT"])
    );
  }

  public get geneString(): string {
    return `${this.strategy} ${Object.values(this._genes)
      .map((gene: Gene<GeneType>) => gene.toString())
      .join(" ")}`;
  }

  private readonly _genes: Record<GeneType, Gene<GeneType>>;

  constructor(
    public readonly id: string,
    public strategy: StrategyType,
    geneList: Gene<GeneType>[]
  ) {
    this._genes = geneList.reduce(
      (
        returnMap: Record<GeneType, Gene<GeneType>>,
        current: Gene<GeneType>
      ) => {
        returnMap[current.type] = current;
        return returnMap;
      },
      {} as Record<GeneType, Gene<GeneType>>
    );
  }

  public mate(other: Individual): Individual {
    const newGenes: Gene<GeneType>[] = [];
    for (const gene of Object.values(this._genes)) {
      if (Math.random() < environment.crossoverChance) {
        newGenes.push(other._genes[gene.type]);
      } else {
        newGenes.push(gene);
      }
    }

    return Math.random() < environment.crossoverChance
      ? new Individual(crypto.randomUUID(), other.strategy, newGenes)
      : new Individual(crypto.randomUUID(), this.strategy, newGenes);
  }

  // TODO - could be better
  public mutate(): Individual {
    const newGenes: Gene<GeneType>[] = [];
    for (const gene of Object.values(this._genes)) {
      if (Math.random() < environment.mutationChance) {
        newGenes.push(GeneFactory.generate(gene.type));
      } else {
        newGenes.push(gene);
      }
    }

    return Math.random() < environment.mutationChance
      ? new Individual(
          this.id,
          Math.random() < 0.5 ? "HARE" : "TORTOISE",
          newGenes
        )
      : new Individual(this.id, this.strategy, newGenes);
  }

  public stop(total: number, taken: Set<number>): boolean {
    return Strategy[this.strategy](total, taken, this._genes);
  }

  public equals(other: Individual): boolean {
    return Object.values(this._genes).every((gene: Gene<GeneType>) =>
      gene.equals(other._genes[gene.type])
    );
  }
}
