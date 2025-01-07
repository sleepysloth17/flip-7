import { environment } from "../../environment";
import { Gene, GeneType, Decision } from "./gene";

// TODO - continue if less than gene
export class MaxRiskGene extends Gene<number> {
  public readonly type: GeneType = GeneType.MAX_RISK;

  // TODO - I'm not sure this is correct tbh, it aligns with max total, I need to do the maths and see if it should be simplified this much
  // do some maths bby
  // this should take into account the current size of the deck and the other cards tha thave gone BUT SHOULD EASILY BE CALCAULABLE
  public stopHandler(total: number, taken: Set<number>): Decision {
    const remaining: number = [...taken].reduce((a, b) => a + b, -taken.size);

    return remaining / (environment.cardsInDeck - taken.size) > this._val
      ? Decision.STOP
      : Decision.DELEGATE;
  }
}
