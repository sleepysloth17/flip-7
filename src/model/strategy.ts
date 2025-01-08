import { GameState, RoundState } from "./game/state";
import { GeneType, Gene, Decision } from "./gene/gene";

export type StrategyHandler = (
  id: string,
  gameState: GameState,
  roundState: RoundState,
  genes: Record<GeneType, Gene<GeneType>>
) => boolean;

export const Strategy = {
  HARE: (
    ...[id, gameState, roundState, genes]: Parameters<StrategyHandler>
  ) => {
    let hasStop: boolean = false;
    for (const gene of Object.values(genes)) {
      switch (gene.stop(id, gameState, roundState)) {
        case Decision.STOP:
          hasStop = true;
          break;
        case Decision.CONTINUE:
          return false;
      }
    }
    return hasStop;
  },
  TORTOISE: (
    ...[id, gameState, roundState, genes]: Parameters<StrategyHandler>
  ) => {
    for (const gene of Object.values(genes)) {
      if (gene.stop(id, gameState, roundState) === Decision.STOP) {
        return true;
      }
    }
    return false;
  },
  DEMOCRATIC_TORTOISE: (
    ...[id, gameState, roundState, genes]: Parameters<StrategyHandler>
  ) => {
    const decisionMap: Record<Decision, number> = Object.values(genes).reduce(
      (returnMap: Record<Decision, number>, current: Gene<GeneType>) => {
        const dec: Decision = current.stop(id, gameState, roundState);
        returnMap[dec] = (returnMap[dec] || 0) + 1;
        return returnMap;
      },
      {} as Record<Decision, number>
    );
    return !!decisionMap[Decision.STOP] &&
      decisionMap[Decision.STOP] >= decisionMap[Decision.CONTINUE]
      ? true
      : false;
  },
  DEMOCRATIC_HARE: (
    ...[id, gameState, roundState, genes]: Parameters<StrategyHandler>
  ) => {
    const decisionMap: Record<Decision, number> = Object.values(genes).reduce(
      (returnMap: Record<Decision, number>, current: Gene<GeneType>) => {
        const dec: Decision = current.stop(id, gameState, roundState);
        returnMap[dec] = (returnMap[dec] || 0) + 1;
        return returnMap;
      },
      {} as Record<Decision, number>
    );
    return !!decisionMap[Decision.STOP] &&
      decisionMap[Decision.STOP] > decisionMap[Decision.CONTINUE]
      ? true
      : false;
  },
} as const;

export type StrategyType = keyof typeof Strategy;

const strategyList: string[] = Object.keys(Strategy);

export const randomStrategy: () => StrategyType = () => {
  return strategyList[
    Math.floor(Math.random() * strategyList.length)
  ] as StrategyType;
};
