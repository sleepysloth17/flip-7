import { Gene, GeneType, Decision } from "./gene";

export class MinCardCount extends Gene<"MIN_CARD_COUNT"> {
  public readonly type: "MIN_CARD_COUNT" = "MIN_CARD_COUNT";

  public stopHandler(total: number, taken: Set<number>): Decision {
    return taken.size > this._val ? Decision.CONTINUE : Decision.DELEGATE;
  }
}
