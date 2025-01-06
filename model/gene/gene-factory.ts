import {
  CurrentNumberCards,
  Gene,
  GeneType,
  MaxRiskGene,
  MaxTotalGene,
} from "../gene";

export class GeneFactory {
  private static readonly MAX_POSSIBLE_ROUND_SCORE: number = 78;
  private static readonly MAX_POSSIBLE_RISK: number = 78;
  private static readonly MAX_POSSIBLE_NUMBER_OF_CARDS = 7;

  public static generateForList(geneTypes: GeneType[]): Gene[] {
    return geneTypes.map(GeneFactory.generate).filter(Boolean) as Gene[];
  }

  private static generate(geneType: GeneType): Gene | null {
    switch (geneType) {
      case GeneType.MAX_TOTAL: {
        return new MaxTotalGene(
          Math.floor(
            Math.random() * (GeneFactory.MAX_POSSIBLE_ROUND_SCORE + 1)
          ),
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
          Math.floor(Math.random() * GeneFactory.MAX_POSSIBLE_NUMBER_OF_CARDS),
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
