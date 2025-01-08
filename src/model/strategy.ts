import { GeneType, Gene, Decision } from "./gene/gene";

export type StrategyHandler = (
  total: number,
  taken: Set<number>,
  genes: Record<GeneType, Gene<GeneType>>
) => boolean;

export const Strategy = {
  HARE: (...[total, taken, genes]: Parameters<StrategyHandler>) => {
    let hasStop: boolean = false;
    for (const gene of Object.values(genes)) {
      switch (gene.stop(total, taken)) {
        case Decision.STOP:
          hasStop = true;
          break;
        case Decision.CONTINUE:
          return false;
      }
    }
    return hasStop;
  },
  TORTOISE: (...[total, taken, genes]: Parameters<StrategyHandler>) => {
    for (const gene of Object.values(genes)) {
      if (gene.stop(total, taken) === Decision.STOP) {
        return true;
      }
    }
    return false;
  },
} as const;

export type StrategyType = keyof typeof Strategy;
