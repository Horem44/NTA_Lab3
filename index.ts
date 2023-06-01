import { DiscreteLogarithmService } from "./services/discrete-logarithm.service";
import { NumericService } from "./services/numeric.service";
import { PrimesService } from "./services/primes.service";

const primesService = new PrimesService();

primesService.primes$.subscribe((primes) => {
  const numericService = new NumericService(primes);
  const discreteLogarithmService = new DiscreteLogarithmService(numericService);

  console.log(discreteLogarithmService.indexCalculus(3n, 5n, 17n));
});
