import { Decision, Gene, GeneType } from "./gene";
import { MaxRiskGene } from "./max-risk-gene";

// TODO
export class MaxTotalScore extends Gene<"MAX_TOTAL_SCORE"> {
  public readonly type: "MAX_TOTAL_SCORE" = "MAX_TOTAL_SCORE";

  protected stopHandler(total: number, taken: Set<number>): Decision {
    throw new Error("Method not implemented.");
  }
}
