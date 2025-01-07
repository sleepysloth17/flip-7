import { environment } from "../../environment";
import {
  MinCardCount,
  Gene,
  GeneType,
  MaxRiskGene,
  MaxTotalGene,
} from "./gene";

export class GeneFactory {
  public static generateForList(geneTypes: GeneType[]): Gene[] {
    return geneTypes.map(GeneFactory.generate);
  }

  public static generate(geneType: GeneType): Gene {
    switch (geneType) {
      case GeneType.MAX_TOTAL: {
        return new MaxTotalGene(
          Math.floor(Math.random() * (environment.maxPossibleRoundScore + 1)),
          Math.random() < 0.5
        );
      }
      case GeneType.MAX_RISK: {
        return new MaxRiskGene(
          Math.round(Math.random() * 100) / 100,
          Math.random() < 0.5
        );
      }
      case GeneType.MIN_CARD_COUNT: {
        return new MinCardCount(
          Math.floor(Math.random() * environment.maxNumberOfCards),
          Math.random() < 0.5
        );
      }
      default: {
        throw new Error(`No gene of type ${geneType}`);
      }
    }
  }

  private constructor() {}
}
