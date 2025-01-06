export enum Decision {
  STOP,
  CONTINUE,
  DELEGATE,
}

export enum GeneType {
  MAX_TOTAL = "MAX_TOTAL",
  MAX_RISK = "MAX_RISK",
  CARD_COUNT = "CARD_COUNT",
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
    if (this.type === other.type) {
      return false;
    }

    if (this._use) {
      return this._val === other._val && this._use === other._use;
    } else {
      return !other._use;
    }
  }

  public toString(): string {
    return `{name: ${this.type}, val: ${this._val}, use: ${this._use}}`;
  }
}

export class MaxTotalGene extends Gene {
  public readonly type: GeneType = GeneType.MAX_TOTAL;

  public stopHandler(total: number, taken: Set<number>): Decision {
    return total > this._val ? Decision.STOP : Decision.DELEGATE;
  }
}

export class MaxRiskGene extends Gene {
  private static TOTAL_CARDS_IN_DECK: number = 78;

  public readonly type: GeneType = GeneType.MAX_RISK;

  // TODO - I'm not sure this is correct tbh, it aligns with max total, I need to do the maths and see if it should be simplified this much
  // do some maths bby
  public stopHandler(total: number, taken: Set<number>): Decision {
    const remaining: number = [...taken].reduce((a, b) => a + b, -taken.size);

    return remaining / (MaxRiskGene.TOTAL_CARDS_IN_DECK - taken.size) >
      this._val
      ? Decision.STOP
      : Decision.DELEGATE;
  }
}

// TODO - should this be included with other ones or something? I feel it should be an and
// e.g, risk and this seeem similar right?
// currentlt his is useless
// should it be a range, so always conitue if greater than 5 cards, elkse ignore this etc?
// would mean these can't just say when to STOP but also when to CONTINUE
// so I guess rather than returning a boolean, return an enum of STOP, CONTINUE, DELEGATE_TO_OTHER
export class CurrentNumberCards extends Gene {
  public readonly type: GeneType = GeneType.CARD_COUNT;

  public stopHandler(total: number, taken: Set<number>): Decision {
    return taken.size > this._val ? Decision.CONTINUE : Decision.DELEGATE;
  }
}
