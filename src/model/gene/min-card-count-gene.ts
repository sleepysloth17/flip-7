import { GameState, RoundState } from "../game/state";
import { Gene, GeneType, Decision } from "./gene";

export class MinCardCount extends Gene<"MIN_CARD_COUNT"> {
  public readonly type: "MIN_CARD_COUNT" = "MIN_CARD_COUNT";

  protected stopHandler(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision {
    return roundState.playerRoundStates[id].taken.size > this._val
      ? Decision.CONTINUE
      : Decision.DELEGATE;
  }
}
