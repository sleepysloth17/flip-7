import { environment } from "../../environment";
import {
  CurrentNumberCards,
  Gene,
  GeneType,
  MaxRiskGene,
  MaxTotalGene,
} from "../gene";

export class GeneFactory {
  public static generateForList(geneTypes: GeneType[]): Gene[] {
    return geneTypes.map(GeneFactory.generate).filter(Boolean) as Gene[];
  }

  private static generate(geneType: GeneType): Gene | null {
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
        return new CurrentNumberCards(
          Math.floor(Math.random() * environment.maxNumberOfCards),
          Math.random() < 0.5
        );
      }
      default: {
        return null;
      }
    }
  }

  private constructor() {}
}
