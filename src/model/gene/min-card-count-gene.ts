import { Gene, GeneType, Decision } from "./gene";

export class MinCardCount extends Gene<number> {
  public readonly type: GeneType = GeneType.MIN_CARD_COUNT;

  public stopHandler(total: number, taken: Set<number>): Decision {
    return taken.size > this._val ? Decision.CONTINUE : Decision.DELEGATE;
  }
}
