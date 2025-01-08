import { environment } from "../../environment";
import { ContinueIfPlayerWillWinGene } from "./continue-if-player-will-win-gene";
import { GeneType, Gene } from "./gene";
import { MaxRiskGene } from "./max-risk-gene";
import { MaxTotalGene } from "./max-total-gene";
import { MaxTotalScoreGene } from "./max-total-score-gene";
import { MinCardCount } from "./min-card-count-gene";
import { MinDistanceToGoalGene } from "./min-distance-to-goal-gene";
import { MinDistanceToNextPlayerGene } from "./min-distance-to-next-player-gene";

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
      case "MAX_TOTAL_SCORE":
        return new MaxTotalScoreGene(
          Math.floor(Math.random() * (environment.goal + 50)),
          Math.random() < 0.5
        );
      case "MIN_DISTANCE_TO_NEXT_PLAYER":
        return new MinDistanceToNextPlayerGene(
          Math.floor(Math.random() * environment.goal),
          Math.random() < 0.5
        );
      case "MIN_DISTANCE_TO_GOAL":
        return new MinDistanceToGoalGene(
          Math.floor(Math.random() * environment.goal),
          Math.random() < 0.5
        );
      case "CONTINUE_IF_PLAYER_WILL_WIN":
        return new ContinueIfPlayerWillWinGene(
          Math.random() < 0.5,
          Math.random() < 0.5
        );
      default: {
        throw new Error(`No gene of type ${geneType}`);
      }
    }
  }

  private constructor() {}
}
