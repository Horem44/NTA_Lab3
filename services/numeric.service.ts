export class NumericService {
  public factorBase: bigint[] = [];

  constructor(private primes: bigint[]) {}

  getBConstant(n: bigint) {
    const c = 3.38;
    const power = this.sqrt(this.log(n) * this.log(this.log(n))) / 2n;

    return Math.floor(c * Math.exp(Number(power)));
  }

  createFactorBase(n: bigint) {
    const B = this.getBConstant(n);

    for (let i = 0; i < B; i++) {
      this.factorBase.push(this.primes[i]);
    }

    console.log('f', this.factorBase);
  }

  calculateAlphaK(alpha: bigint, k: bigint, n: bigint) {
    return this.moduloHornerScheme(alpha, k, n);
  }

  isSmooth(n: bigint) {
    const decomposition = this.numberDecomposition(n);

    if (decomposition.length === 0) {
      return false;
    }

    return decomposition.every((el) => this.factorBase.includes(el.divisor));
  }

  numberDecomposition(n: bigint) {
    const decomposition: {
      divisor: bigint;
      power: bigint;
    }[] = [];

    while (n > 1) {
      const divisor = this.trialDivisionMethod(n);
      const exisitingDivisor = decomposition.find(
        (element) => element.divisor === divisor
      );

      if (!divisor) {
        break;
      }

      if (exisitingDivisor) {
        exisitingDivisor.power++;
      } else {
        decomposition.push({
          divisor,
          power: 1n,
        });
      }

      n = n / divisor;
    }

    return decomposition;
  }

  trialDivisionMethod(n: bigint): bigint | undefined {
    for (let i = 0; i < this.primes.length; i++) {
      if (n % this.primes[i] === 0n) {
        return this.primes[i];
      }
    }
  }

  createEquation(alpha: bigint, n: bigint) {
    const k = BigInt(Math.floor(Math.random() * Number(n - 1n)));
    const alphaK = this.calculateAlphaK(alpha, k, n);
    const isAlphaKSmooth = this.isSmooth(alphaK);
    
    if (!isAlphaKSmooth) {
      return null;
    }

    const numberToDecompose = this.numberDecomposition(alphaK);

    const greatestIndex = this.factorBase.indexOf(
      numberToDecompose[numberToDecompose.length - 1].divisor
    );

    const result: any = [];
    let temp: bigint[] = [];

    const indexes = numberToDecompose.map((el) =>
      ({index: this.factorBase.indexOf(el.divisor), power: el.power})
    );

    for (let i = 0; i <= greatestIndex; i++) {
      const existingIndex = indexes.find(el => el.index === i);

      if (existingIndex) {
        temp[i] = existingIndex.power;
      }else{
        temp[i] = 0n;
      }
    }

    result.push(temp);
    result.push(k);

    return result;
  }

  buildEquationSystem(alpha: bigint, n: bigint) {
    const equationsAmount = this.factorBase.length + 15;
    const coefficients: bigint[][] = [];
    const constants: bigint[] = [];

    while (coefficients.length < equationsAmount) {
      const equation = this.createEquation(alpha, n);

      if (equation) {
        coefficients.push(equation[0]);
        constants.push(equation[1]);
      }
    }

    return {
      coefficients,
      constants,
    };
  }

  moduloHornerScheme(base: bigint, power: bigint, modulo: bigint): bigint {
    let result = 1n;
    base = base % modulo;

    while (power > 0) {
      if (power % 2n === 1n) {
        result = (result * base) % modulo;
      }

      power = power / 2n;
      base = (base * base) % modulo;
    }

    return result;
  }

  solveSystemOfEquations(coefficients: bigint[][], constants: bigint[], modulus: bigint): bigint[] | null {
    const n = coefficients.length;
  
    const A: bigint[][] = [];
    const B: bigint[] = [];
    for (let i = 0; i < n; i++) {
      A[i] = [...coefficients[i]];
      B[i] = constants[i];
    }
  
    for (let i = 0; i < n; i++) {
      let pivotRow = i;
      for (let j = i + 1; j < n; j++) {
        if (this.absBigInt(A[j][i]) > this.absBigInt(A[pivotRow][i])) {
          pivotRow = j;
        }
      }
  
      if (A[pivotRow][i] === BigInt(0)) {
        return null;
      }
  
      if (pivotRow !== i) {
        [A[i], A[pivotRow]] = [A[pivotRow], A[i]];
        [B[i], B[pivotRow]] = [B[pivotRow], B[i]];
      }
  
      const modInverseVal = this.modInverse(A[i][i], modulus);
      for (let j = i + 1; j < n; j++) {
        const ratio = (A[j][i] * modInverseVal) % modulus;
        for (let k = i; k < n; k++) {
          A[j][k] = (A[j][k] - ratio * A[i][k] + modulus) % modulus;
        }
        B[j] = (B[j] - ratio * B[i] + modulus) % modulus;
      }
    }
  
    const solution: bigint[] = [];
    for (let i = n - 1; i >= 0; i--) {
      let sum = BigInt(0);
      for (let j = i + 1; j < n; j++) {
        sum = (sum + A[i][j] * solution[j] + modulus) % modulus;
      }
      solution[i] = ((B[i] - sum) * this.modInverse(A[i][i], modulus) + modulus) % modulus;
    }
  
    return solution;
  }
  
  modInverse(a: bigint, m: bigint): bigint {
    a = (a % m + m) % m;
    for (let x = BigInt(1); x < m; x++) {
      if ((a * x) % m === BigInt(1)) {
        return x;
      }
    }
    return BigInt(1);
  }
  
  absBigInt(n: bigint): bigint {
    const zero = BigInt(0);
    return n < zero ? -n : n;
  }
  

  private sqrt(n: bigint): bigint {
    if (n < 2n) {
      return n;
    }

    if (n < 16n) {
      return BigInt(Math.sqrt(Number(n)) | 0);
    }

    let x0: bigint;
    let x1: bigint;

    if (n < 4503599627370496n) {
      x1 = BigInt(Math.sqrt(Number(n)) | 0) - 3n;
    } else {
      let vlen = n.toString().length;

      if (!(vlen & 1)) {
        x1 = 10n ** BigInt(vlen / 2);
      } else {
        x1 = 4n * 10n ** BigInt((vlen / 2) | 0);
      }
    }

    do {
      x0 = x1;
      x1 = (n / x0 + x0) >> 1n;
    } while (x0 !== x1 && x0 !== x1 - 1n);

    return x0;
  }

  private log(n: bigint) {
    return BigInt(n.toString(2).length);
  }
}
