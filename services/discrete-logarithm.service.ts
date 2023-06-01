import { NumericService } from "./numeric.service";

export class DiscreteLogarithmService {
  constructor(private readonly numericService: NumericService) {}

  indexCalculus(a: bigint, b: bigint, n: bigint) {
    this.numericService.createFactorBase(n);

    let system = this.numericService.buildEquationSystem(a, n);

    let maxVectorLength = 0;

    system.coefficients.forEach((coef) => {
      if (coef.length > maxVectorLength) {
        maxVectorLength = coef.length;
      }
    });

    system.coefficients.forEach((coef) => {
      while (coef.length < maxVectorLength) {
        coef.push(0n);
      }
    });

    console.log(system.coefficients.length === system.constants.length);

    // const solution = this.numericService.solveLinearSystem(
    //   system.coefficients,
    //   system.constants,
    //   n - 1n
    // );

    // console.log(solution);

    // if(!solution){
    //   return;
    // }

    // for (let i = 0; i < n - 1n; i++) {
    //   const numToCheck = (b * a ** BigInt(i)) % n;

    //   if (this.numericService.isSmooth(numToCheck)) {
    //     const decomposition =
    //       this.numericService.numberDecomposition(numToCheck);

    //     const sum = decomposition.reduce(
    //       (acc, el) =>
    //         acc +
    //         el.power *
    //           solution[this.numericService.factorBase.indexOf(el.divisor)],
    //       0n
    //     );

    //     return (sum - BigInt(i)) % (n - 1n);
    //   }
    // }
  }
}
