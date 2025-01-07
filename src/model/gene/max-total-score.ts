import { Decision, Gene, GeneType } from "./gene";

// TODO
export class MaxTotalScore extends Gene<number> {
  public readonly type: GeneType = GeneType.MAX_TOTAL_SCORE;

  protected stopHandler(total: number, taken: Set<number>): Decision {
    throw new Error("Method not implemented.");
  }
}
