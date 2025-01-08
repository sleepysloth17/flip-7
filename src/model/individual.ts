import { environment } from "../environment";
import { GameState, RoundState } from "./game/state";
import { Gene, GeneType } from "./gene/gene";
import { GeneFactory } from "./gene/gene-factory";
import { randomStrategy, Strategy, StrategyType } from "./strategy";

export class Individual {
  public static generate(id?: string): Individual {
    return new Individual(
      id || crypto.randomUUID(),
      randomStrategy(),
      GeneFactory.generateForList([
        "MAX_TOTAL",
        "MIN_CARD_COUNT",
        "MAX_TOTAL_SCORE",
        "MIN_DISTANCE_TO_NEXT_PLAYER",
        "MIN_DISTANCE_TO_GOAL",
        "CONTINUE_IF_PLAYER_WILL_WIN",
      ])
    );
  }

  public get geneString(): string {
    return `${this.strategy} ${Object.values(this._genes)
      .map((gene: Gene<GeneType>) => gene.toString())
      .filter(Boolean)
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
      ? new Individual(this.id, randomStrategy(), newGenes)
      : new Individual(this.id, this.strategy, newGenes);
  }

  public stop(gameState: GameState, roundState: RoundState): boolean {
    return Strategy[this.strategy](this.id, gameState, roundState, this._genes);
  }

  public equals(other: Individual): boolean {
    return Object.values(this._genes).every((gene: Gene<GeneType>) =>
      gene.equals(other._genes[gene.type])
    );
  }
}
