import { environment } from "../../environment";
import { GeneType, Gene } from "./gene";
import { MaxRiskGene } from "./max-risk-gene";
import { MaxTotalGene } from "./max-total-gene";
import { MinCardCount } from "./min-card-count-gene";

export class GeneFactory {
  public static generateForList(geneTypes: GeneType[]): Gene<GeneType>[] {
    return geneTypes.map(GeneFactory.generate);
  }

  public static generate(geneType: GeneType): Gene<GeneType> {
    switch (geneType) {
      case "MAX_TOTAL": {
        return new MaxTotalGene(
          Math.floor(Math.random() * (environment.maxPossibleRoundScore + 1)),
          Math.random() < 0.5
        );
      }
      case "MAX_RISK": {
        return new MaxRiskGene(
          Math.round(Math.random() * 100) / 100,
          Math.random() < 0.5
        );
      }
      case "MIN_CARD_COUNT": {
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
