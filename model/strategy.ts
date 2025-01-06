import { Decision, Gene, GeneType } from "./gene";

// do I want to say, have DEFAULT_STOP or DEFAULT_CONTINUE and one continues if told, other stops if told
export enum Strategy {
  HARE = "HARE", // prefers to continue
  TORTOISE = "TORTOISE", // prefers to stop
}

export const strategyHandler: (
  total: number,
  taken: Set<number>,
  genes: Record<GeneType, Gene>
) => boolean = (
  total: number,
  taken: Set<number>,
  genes: Record<GeneType, Gene>
) => {
  const decisions: Record<Decision, number> = Object.values(genes)
    .map((gene: Gene) => gene.stop(total, taken))
    .reduce((returnMap: Record<Decision, number>, current: Decision) => {
      returnMap[current] = (returnMap[current] || 0) + 1;
      return returnMap;
    }, {} as Record<Decision, number>);
  // TODO - this should use the stragey gene that I shall add
  return !decisions[Decision.CONTINUE] ? !!decisions[Decision.STOP] : false;
  return (
    !!decisions[Decision.STOP] &&
    decisions[Decision.STOP] > (decisions[Decision.CONTINUE] || 0)
  );
};
