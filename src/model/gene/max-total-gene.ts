import { GameState, RoundState } from "../game/state";
import { Gene, GeneType, Decision } from "./gene";

// TODO - continue if less than gene
export class MaxTotalGene extends Gene<"MAX_TOTAL"> {
  public type: "MAX_TOTAL" = "MAX_TOTAL";

  protected stopHandler(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision {
    return roundState.playerRoundStates[id].total > this._val
      ? Decision.STOP
      : Decision.DELEGATE;
  }
}
