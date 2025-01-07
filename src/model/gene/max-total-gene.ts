import { Gene, GeneType, Decision } from "./gene";

// TODO - continue if less than gene
export class MaxTotalGene extends Gene<number> {
  public readonly type: GeneType = GeneType.MAX_TOTAL;

  public stopHandler(total: number, taken: Set<number>): Decision {
    return total > this._val ? Decision.STOP : Decision.DELEGATE;
  }
}
