import { GameState, RoundState } from "../game/state";
import { Decision, Gene } from "./gene";

export class MinDistanceToNextPlayerGene extends Gene<"MIN_DISTANCE_TO_NEXT_PLAYER"> {
  public type: "MIN_DISTANCE_TO_NEXT_PLAYER" = "MIN_DISTANCE_TO_NEXT_PLAYER";

  protected stopHandler(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision {
    const currentPlayerScores: { id: string; score: number }[] = Object.keys(
      gameState.scores
    )
      .map((_id: string) => ({
        id: _id,
        score: gameState.scores[id] + roundState.playerRoundStates[id].total,
      }))
      .sort((a, b) => a.score - b.score);
    const playerIndex: number = currentPlayerScores.findIndex(
      (a) => a.id === id
    );

    return playerIndex < currentPlayerScores.length - 1
      ? currentPlayerScores[playerIndex + 1].score -
          currentPlayerScores[playerIndex].score <
        this._val
        ? Decision.CONTINUE
        : Decision.DELEGATE
      : Decision.DELEGATE;
  }
}
