import { Population } from "./model/population";
import { Individual } from "./model/individual";
import { environment } from "./environment";

/**
 * 1) Randomly initialize populations p
 * 2) Determine fitness of population
 * 3) Until convergence evolve
 */
const run: (size: number) => Individual[] = (size: number) => {
  console.time();
  let population: Population = Population.initialise(size);
  while (!population.converged()) {
    console.log("-".repeat(process.stdout.columns));
    population.printTopN(5);
    population = population.evolve();
  }
  console.log("-".repeat(process.stdout.columns));
  population.printTopN();
  console.timeEnd();
  return population.members;
};

run(environment.populationSize);
