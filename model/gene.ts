enum Decision {
  STOP,
  CONTINUE,
  DELEGATE,
}

type GeneType = "max-total" | "max-risk" | "card-count";

abstract class Gene {
  protected abstract readonly _type: GeneType;

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
    if (this._type === other._type) {
      return false;
    }

    if (this._use) {
      return this._val === other._val && this._use === other._use;
    } else {
      return !other._use;
    }
  }

  public toString(): string {
    return `{name: ${this._type}, val: ${this._val}, use: ${this._use}}`;
  }
}

class MaxTotalGene extends Gene {
  protected readonly _type: GeneType = "max-total";

  public stopHandler(total: number, taken: Set<number>): Decision {
    return total > this._val ? Decision.STOP : Decision.DELEGATE;
  }
}

class MaxRiskGene extends Gene {
  private static TOTAL_CARDS_IN_DECK: number = 78;

  protected readonly _type: GeneType = "max-risk";

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
class CurrentNumberCards extends Gene {
  protected readonly _type: GeneType = "card-count";

  public stopHandler(total: number, taken: Set<number>): Decision {
    return taken.size > this._val ? Decision.CONTINUE : Decision.DELEGATE;
  }
}
