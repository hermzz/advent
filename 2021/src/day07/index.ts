import run from "aocrunner";

type Crab = number;
const parseInput = (rawInput: string): Crab[] => rawInput.split(",").map(n => parseInt(n, 10));

const part1 = (rawInput: string) => {
  const crabs = parseInput(rawInput);
  return Math.min(...Array.from({length: Math.max(...crabs)}, (_v, i) =>
    crabs.reduce((pv, v) => pv + Math.abs(i - v), 0)
  ));
};

const triangular = (n: number): number => n*(n+1)/2;

const part2 = (rawInput: string) => {
  const crabs = parseInput(rawInput);
  return Math.min(...Array.from({length: Math.max(...crabs)}, (_v, i) =>
    crabs.reduce((pv, v) => pv + triangular(Math.abs(i - v)), 0)
  ));
};

run({
  part1: {
    tests: [
      { input: `16,1,2,0,4,2,7,1,2,14`, expected: 37 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `16,1,2,0,4,2,7,1,2,14`, expected: 168 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});