import { environment } from "../../environment";
import { GameState, RoundState } from "../game/state";
import { Decision, Gene } from "./gene";

export class ContinueIfPlayerWillWinGene extends Gene<"CONTINUE_IF_PLAYER_WILL_WIN"> {
  public type: "CONTINUE_IF_PLAYER_WILL_WIN" = "CONTINUE_IF_PLAYER_WILL_WIN";

  protected stopHandler(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision {
    if (!this._val) {
      return Decision.DELEGATE;
    }

    for (const playerId of Object.keys(gameState.scores)) {
      if (
        playerId !== id &&
        gameState.scores[playerId] +
          roundState.playerRoundStates[playerId].total >
          environment.goal
      ) {
        return Decision.CONTINUE;
      }
    }

    return Decision.DELEGATE;
  }
}
