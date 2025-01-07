export enum Decision {
  STOP,
  CONTINUE,
  DELEGATE,
}

// max stops there, min continues there
// need to work out how to handle if someone has already won
// TODO - I want to see fi I can do something cool using types e.g define the val type in here as well so it's aligned
export enum GeneType {
  MAX_TOTAL = "MAX_TOTAL",
  MIN_TOTAL = "MIN_TOTAL", // TODO - continues
  MAX_RISK = "MAX_RISK",
  MIN_RISK = "MIN_RISK", // TODO - continues
  MIN_CARD_COUNT = "MIN_CARD_COUNT",
  MIN_DISTANCE_TO_NEXT_PLAYER = "MIN_DISTANCE_TO_NEXT_PLAYER", // TODO
  MIN_DISTANCE_TO_GOAL = "MIN_DISTANCE_TO_GOAL", // TODO
  MAX_TOTAL_SCORE = "MAX_TOTAL_SCORE", // TODO
}

export abstract class Gene<T> {
  public abstract readonly type: GeneType;

  constructor(protected _val: T, protected _use: boolean) {}

  public stop(total: number, taken: Set<number>): Decision {
    if (this._use) {
      return this.stopHandler(total, taken);
    } else {
      return Decision.DELEGATE;
    }
  }

  protected abstract stopHandler(total: number, taken: Set<number>): Decision;

  public equals<U>(other: Gene<U>): boolean {
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
