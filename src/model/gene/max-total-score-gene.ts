import { GameState, RoundState } from "../game/state";
import { Decision, Gene } from "./gene";

// TODO
export class MaxTotalScoreGene extends Gene<"MAX_TOTAL_SCORE"> {
  public readonly type: "MAX_TOTAL_SCORE" = "MAX_TOTAL_SCORE";

  protected stopHandler(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision {
    return roundState.playerRoundStates[id].total + gameState.scores[id] >
      this._val
      ? Decision.STOP
      : Decision.DELEGATE;
  }
}
