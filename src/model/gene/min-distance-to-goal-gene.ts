import { environment } from "../../environment";
import { GameState, RoundState } from "../game/state";
import { Decision, Gene } from "./gene";

export class MinDistanceToGoalGene extends Gene<"MIN_DISTANCE_TO_GOAL"> {
  public type: "MIN_DISTANCE_TO_GOAL" = "MIN_DISTANCE_TO_GOAL";

  protected stopHandler(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision {
    const score: number =
      gameState.scores[id] + roundState.playerRoundStates[id].total;
    return environment.goal > score && environment.goal - score < this._val
      ? Decision.CONTINUE
      : Decision.DELEGATE;
  }
}
