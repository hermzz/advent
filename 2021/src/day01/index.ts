import run from "aocrunner";

const parseInput = (rawInput: string): number[] => {
  return rawInput.split("\n").map(v => parseInt(v));
};

const sum = (ints: number[]): number => {
  return ints.reduce((prevValue, currValue) => { return prevValue + currValue; });
}

const countIncreases = (depths: number[], window: number = 1): number => {
  let numIncreases = 0;
  let index = 1;
  while (index < depths.length - window + 1) {
    const prevWindow = depths.slice(index - 1, index - 1 + window);
    const currWindow = depths.slice(index, index + window);

    if (sum(prevWindow) < sum(currWindow)) {
      numIncreases += 1;
    }
    index += 1;
  }
  return numIncreases;
}

const part1 = (rawInput: string) => {
  const depths = parseInput(rawInput);
  return countIncreases(depths);
};

const part2 = (rawInput: string) => {
  const depths = parseInput(rawInput);
  return countIncreases(depths, 3);
};

run({
  part1: {
    tests: [
      { input: `199\n200\n208\n210\n200\n207\n240\n269\n260\n263`, expected: 7 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `199\n200\n208\n210\n200\n207\n240\n269\n260\n263`, expected: 5 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
