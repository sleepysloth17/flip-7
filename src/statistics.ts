// TODO - other players
// TODO - pass in runs and players
// TODO - work out avergae number of turns until you get TARGET if you stop at NUMBER
function playUntilBust(): { on: number; total: number } {
  const deck: number[] = new Array(12)
    .fill(null)
    .flatMap((_: null, i: number) => new Array(i + 1).fill(i + 1));

  let total: number = 0;
  let taken: Set<number> = new Set();

  const take: () => number = () => {
    const index: number = Math.floor(Math.random() * deck.length);
    return deck.splice(index, 1)[0];
  };

  while (deck.length) {
    const num: number = take();

    if (taken.has(num)) {
      return { on: num, total };
    }

    total += num;
    taken.add(num);
  }

  // TODO - shouldn't hit this until I add other players
  return { on: -1, total };
}

// returns score or 0 if bust
function playUntilGoal(goal: number): number {
  const deck: number[] = new Array(12)
    .fill(null)
    .flatMap((_: null, i: number) => new Array(i + 1).fill(i + 1));

  let total: number = 0;
  let taken: Set<number> = new Set();

  const take: () => number = () => {
    const index: number = Math.floor(Math.random() * deck.length);
    return deck.splice(index, 1)[0];
  };

  // while (deck.length && total < goal) {
  while (deck.length && total < goal && taken.size < 7) {
    const num: number = take();

    if (taken.has(num)) {
      return 0;
    }

    total += num;
    taken.add(num);
  }

  return total + (taken.size === 7 ? 15 : 0);
  // return total;
}

function turnsUntilGoal(goal: number, perTurn: number) {
  let turns: number = 0;
  let total: number = 0;

  while (total < goal) {
    total += playUntilGoal(perTurn);
    turns++;
  }

  return turns;
}

// TODO colour with chalk or soemthing, then also calc and colour standard deviations
// TODO also want the percentage of the runs that we get each bit (e.g percetnage we bust on 12)
function printGraph(width: number, map: Record<number, number>): void {
  console.log("-".repeat(width));

  const max: number = Math.max(...Object.values(map));
  const per: number = (width - 8) / max;

  Object.keys(map).forEach((key: string) => {
    console.log(`${key}\t${"#".repeat(Math.floor(per * map[+key]))}`);
  });
}

console.time();

const RUNS: number = 100000;

for (let perTurn of new Array(40).fill(10).map((a, b) => a + b)) {
  let totalTUrns: number = 0;
  // let all: number = 0;
  // let onMap: Record<number, number> = {};
  // let totalMap: Record<number, number> = {};
  for (let i = 0; i < RUNS; i++) {
    // const { on, total } = playUntilBust();
    // onMap[on] = (onMap[on] || 0) + 1;
    // totalMap[total] = (totalMap[total] || 0) + 1;
    // all += total;
    totalTUrns += turnsUntilGoal(200, perTurn);
  }

  console.log(`AVG TURNS: ${totalTUrns / RUNS} with per turn goal ${perTurn}`);
}

// console.log(onMap, totalMap);

// const width: number = process.stdout.columns;

// printGraph(width, onMap);
// printGraph(width, totalMap);

// console.log(`AVG: ${all / RUNS}`);

console.timeEnd();
