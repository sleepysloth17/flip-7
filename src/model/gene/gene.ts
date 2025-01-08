import { GameState, RoundState } from "../game/state";

export enum Decision {
  STOP = "STOP",
  CONTINUE = "CONTINUE",
  DELEGATE = "DELEGATE",
}

// max stops there, min continues there
// need to work out how to handle if someone has already won
// TODO - I want to see fi I can do something cool using types e.g define the val type in here as well so it's aligned
// export enum GeneType {
//   MAX_TOTAL = "MAX_TOTAL",
//   MIN_TOTAL = "MIN_TOTAL", // TODO - continues
//   MAX_RISK = "MAX_RISK",
//   MIN_RISK = "MIN_RISK", // TODO - continues
//   MIN_CARD_COUNT = "MIN_CARD_COUNT",
//   MIN_DISTANCE_TO_NEXT_PLAYER = "MIN_DISTANCE_TO_NEXT_PLAYER", // TODO
//   MIN_DISTANCE_TO_GOAL = "MIN_DISTANCE_TO_GOAL", // TODO
// }
const GENE_TYPE = {
  MAX_TOTAL: (arg: unknown) => arg as number, // max to take in a round
  MAX_RISK: (arg: unknown) => arg as number, // max risk to take (rough percentage of failiure)
  MIN_CARD_COUNT: (arg: unknown) => arg as number, // if you have at least X cards, continue
  MAX_TOTAL_SCORE: (arg: unknown) => arg as number, // if you have max total score X, stop
  MIN_DISTANCE_TO_NEXT_PLAYER: (arg: unknown) => arg as number, // if you are more than X behind the next player, continue
  MIN_DISTANCE_TO_GOAL: (arg: unknown) => arg as number, // if you are X away from the goal, continue
} as const;

export type GeneType = keyof typeof GENE_TYPE;

type GeneValType<T extends GeneType> = (typeof GENE_TYPE)[T] extends (
  arg: unknown
) => infer R
  ? R
  : never;

export abstract class Gene<T extends GeneType> {
  public abstract readonly type: T;

  constructor(protected _val: GeneValType<T>, protected _use: boolean) {}

  public stop(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision {
    if (this._use) {
      return this.stopHandler(id, gameState, roundState);
    } else {
      return Decision.DELEGATE;
    }
  }

  protected abstract stopHandler(
    id: string,
    gameState: GameState,
    roundState: RoundState
  ): Decision;

  public equals(other: Gene<T>): boolean {
    if (this.type !== other.type) {
      return false;
    } else if (!this._use) {
      return !other._use;
    }

    // we can cast as we do a type check above
    return (
      this._val === (other._val as unknown as T) && this._use === other._use
    );
  }

  public toString(): string {
    return `{name: ${this.type}, val: ${this._val}, use: ${this._use}}`;
  }
}
