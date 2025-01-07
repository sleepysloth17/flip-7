import { Gene, GeneType, Decision } from "./gene";

// TODO - continue if less than gene
export class MaxTotalGene extends Gene<"MAX_TOTAL"> {
  public type: "MAX_TOTAL" = "MAX_TOTAL";

  public stopHandler(total: number, taken: Set<number>): Decision {
    return total > this._val ? Decision.STOP : Decision.DELEGATE;
  }
}
