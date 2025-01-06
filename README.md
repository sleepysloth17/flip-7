# flip 7 strategy

GOAL: minimise number of rounds to read 200

TODO:

- More stats analysis
- Handle special cards
- Allow to define strategies to pass into game
  - Target numbers
  - Stopping on specific numbers in the hand
  - Easy to handle card counting etc
  - Easy expected value etc
- Take into account different numbers of players using different strategies so can work out which beats which
- Performance
- Could I use ML somehow (genetic alg?) to "learn" strategies?
  - for basic genetic alg, could probably define basic params of strategy e.g goal, stop on card of type in hand etc
  - could I, to stop, use total "points" of deck remaining that will fuck me? that's basically card counting
    - 12 pts from one 12 card leaves 11 to fuck you, 12 pts from one 5 and one 7 leaves 10 (4+6), 12 pts from one 4 and one 3 and one 5 leaves (2+3+4) 9 etc

## genetic

minimise:

- number of rounds to get 200

params:

- current sum
- cards left in deck that can fuck you (see above for how to work out easy pts)
- current number of cards (take into account the 15pts I guess)

when other players:

- diff between your score and theirs

should it be all ors?
or is it a statment like continue if: `total < num && cardCount < num || numCard > num || diff > num` for example
or would it be something liek currentdiff if you stop < num
i guess if you have 6 cards, could be worth continuing
maybe stop if A or B or C or D or something
or a mix of them all
I guess can randomise the OR or AND

Will fist do without other players, then will do with other players
