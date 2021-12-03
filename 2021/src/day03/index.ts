import run from "aocrunner";


const parseInput = (rawInput: string): number[][] => {
  return rawInput.split("\n").map((line: string) => {
    return line.split("").map(n => parseInt(n, 2));
  })
};

const findRating = (reports: number[][], calcFunc: (reports: number[][], index: number) => number): number[] => {
  let index = 0;
  const limit = reports.length;
  while (index < limit) {
    const bitFilter = calcFunc(reports, index);

    reports = reports.filter((report: number[]) => report[index] == bitFilter);
    if (reports.length === 1) {
      return reports[0];
    }

    index += 1;
  }

  return [];
}

const bitSum = (reports: number[][], index: number): number => reports.reduce((prevValue, currValue): number => {
  return prevValue += currValue[index];
}, 0);

const calculateMostCommonBit = (reports: number[][], index: number): number => (bitSum(reports, index) >= reports.length / 2) ? 1 : 0 ;
const calculateLeastCommonBit = (reports: number[][], index: number): number => (bitSum(reports, index) < reports.length / 2) ? 1 : 0 ;

const getCommonBits = (reports: number[][], calcFunc: (reports: number[][], index: number) => number): number[] =>
  reports[0].map((_v, index) => calcFunc(reports, index));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const gamma = parseInt(getCommonBits(input, calculateMostCommonBit).join(""), 2);
  const epsilon = parseInt(getCommonBits(input, calculateLeastCommonBit).join(""), 2);

  return gamma * epsilon;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const oxygenRating = parseInt(findRating(input, calculateMostCommonBit).join(""), 2);
  const co2Rating = parseInt(findRating(input, calculateLeastCommonBit).join(""), 2);

  return oxygenRating * co2Rating;
};

run({
  part1: {
    tests: [
      { input: `00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010`, expected: 198 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010`, expected: 230 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
