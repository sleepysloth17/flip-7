import { environment } from "../../environment";

export enum Decision {
  STOP,
  CONTINUE,
  DELEGATE,
}

// max stops there, min continues there
export enum GeneType {
  MAX_TOTAL = "MAX_TOTAL",
  MIN_TOTAL = "MIN_TOTAL", // TODO - continues
  MAX_RISK = "MAX_RISK",
  MIN_RISK = "MIN_RISK", // TODO - continues
  MIN_CARD_COUNT = "MIN_CARD_COUNT",
  MIN_DISTANCE_TO_NEXT_PLAYER = "MIN_DISTANCE_TO_NEXT_PLAYER", // TODO
  MIN_DISTANCE_TO_GOAL = "MIN_DISTANCE_TO_GOAL", // TODO
}

export abstract class Gene {
  public abstract readonly type: GeneType;

  constructor(
    // TODO - generic val?
    protected _val: number,
    protected _use: boolean
  ) {}

  public stop(total: number, taken: Set<number>): Decision {
    if (this._use) {
      return this.stopHandler(total, taken);
    } else {
      return Decision.DELEGATE;
    }
  }

  protected abstract stopHandler(total: number, taken: Set<number>): Decision;

  public equals(other: Gene): boolean {
    if (this.type !== other.type) {
      return false;
    } else if (!this._use) {
      return !other._use;
    }

    return this._val === other._val && this._use === other._use;
  }

  public toString(): string {
    return `{name: ${this.type}, val: ${this._val}, use: ${this._use}}`;
  }
}

// TODO - continue if less than gene
export class MaxTotalGene extends Gene {
  public readonly type: GeneType = GeneType.MAX_TOTAL;

  public stopHandler(total: number, taken: Set<number>): Decision {
    return total > this._val ? Decision.STOP : Decision.DELEGATE;
  }
}

// TODO - continue if less than gene
export class MaxRiskGene extends Gene {
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

export class MinCardCount extends Gene {
  public readonly type: GeneType = GeneType.MIN_CARD_COUNT;

  public stopHandler(total: number, taken: Set<number>): Decision {
    return taken.size > this._val ? Decision.CONTINUE : Decision.DELEGATE;
  }
}
