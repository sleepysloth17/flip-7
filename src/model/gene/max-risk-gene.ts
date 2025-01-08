import { environment } from "../../environment";
import { GameState, RoundState } from "../game/state";
import { Gene, GeneType, Decision } from "./gene";

// TODO - continue if less than gene
export class MaxRiskGene extends Gene<"MAX_RISK"> {
  public type: "MAX_RISK" = "MAX_RISK";

  // TODO - I'm not sure this is correct tbh, it aligns with max total, I need to do the maths and see if it should be simplified this much
  // do some maths bby
  // this should take into account the current size of the deck and the other cards tha thave gone BUT SHOULD EASILY BE CALCAULABLE
  protected stopHandler(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision {
    throw new Error("Not implemented");
  }
}
