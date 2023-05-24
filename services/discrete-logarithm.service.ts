import { NumericService } from "./numeric.service";

export class DiscreteLogarithmService {
  constructor(private readonly numericService: NumericService) {}

  indexCalculus(a: bigint, b: bigint, n: bigint) {
    const system = this.numericService.buildEquationSystem(a, n);

    console.log(system);

    const solution = this.numericService.solveLinearSystem(
      system.coefficients,
      system.constants,
      n - 1n
    );

    console.log(solution);

    for (let i = 0; i < n - 1n; i++) {
      const numToCheck = (b * a ** BigInt(i)) % n;

      if (this.numericService.isSmooth(numToCheck)) {
        const decomposition =
          this.numericService.numberDecomposition(numToCheck);

        const sum = decomposition.reduce(
          (acc, el) =>
            acc +
            el.power *
              solution[this.numericService.factorBase.indexOf(el.divisor)],
          0n
        );

        return (sum - BigInt(i)) % (n - 1n);
      }
    }
  }
}
