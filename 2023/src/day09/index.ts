import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map(line => line.split(" ").map(n => parseInt(n)));

const allEqual = (numbers: number[]): boolean => 
  numbers.slice(1).reduce((pv, v, i, ns) => pv && v == ns[i-1], true);
;

const diff = (numbers: number[]): number[][] =>
  allEqual(numbers) ?
    [numbers] :
    diff(numbers.slice(0, -1).map((n, i) => numbers[i+1] - n)).concat([numbers])
;

const extrapolate = (numbers: number[], calcFunc: (ns: number[], n: number) => number ): number => 
  diff(numbers).reduce((pv, ns) => calcFunc(ns, pv), 0)
;

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map(numbers => extrapolate(numbers, (ns, n) => ns[ns.length - 1] + n))
    .reduce((pv, n) => pv + n, 0)
;

const part2 = (rawInput: string) => 
  parseInput(rawInput)
    .map(numbers => extrapolate(numbers, (ns, n) => ns[0] - n))
    .reduce((pv, n) => pv + n, 0)
;

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
