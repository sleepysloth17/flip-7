import { Population } from "./model/population";

/**
 * 1) Randomly initialize populations p
 * 2) Determine fitness of population
 * 3) Until convergence evolve
 */
const run: (size: number) => Individual[] = (size: number) => {
  let population: Population = Population.initialise(size);
  while (!population.converged()) {
    console.log("-".repeat(process.stdout.columns));
    population.printTopN(5);
    population = population.evolve();
  }
  console.log("-".repeat(process.stdout.columns));
  population.printTopN(20);
  return population.members;
};

run(1000);
