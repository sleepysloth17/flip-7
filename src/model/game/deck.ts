import { shuffle } from "../../util/array";

export enum CardType {
  NUMBER = "NUMBER",
  TIMES_TWO = "TIMES_TWO",
  SPECIAL_NUMBER = "SPECIAL_NUMBER",
  SECOND_CHANGE = "SECOND_CHANCE",
  FREEZE = "FREEZE",
  FLIP_THREE = "FLIP_THREE",
}

export class Card {
  constructor(public readonly type: CardType, public readonly value: number) {}
}

export class Deck {
  public static create(): Deck {
    const deck: Deck = new Deck(
      new Array(12)
        .fill(null)
        .flatMap((_: null, i: number) =>
          new Array(i + 1)
            .fill(i + 1)
            .map((val: number) => new Card(CardType.NUMBER, val))
        )
        .concat(new Card(CardType.NUMBER, 0))
        .concat(
          new Card(CardType.SPECIAL_NUMBER, 2),
          new Card(CardType.SPECIAL_NUMBER, 4),
          new Card(CardType.SPECIAL_NUMBER, 6),
          new Card(CardType.SPECIAL_NUMBER, 8),
          new Card(CardType.SPECIAL_NUMBER, 10)
        )
    );
    deck.reshuffle();
    return deck;
  }

  private toDraw: number = 0;

  constructor(private _deck: Card[]) {}

  public reshuffle(): void {
    shuffle(this._deck);
    this.toDraw = 0;
  }

  public draw(): Card {
    return this._deck[this.toDraw++];
  }

  public isEmpty(): boolean {
    return this.toDraw === this._deck.length;
  }
}
