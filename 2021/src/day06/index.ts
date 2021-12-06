import run from "aocrunner";

type Fish = number;

const parseInput = (rawInput: string): Fish[] => rawInput.split(",").map(n => parseInt(n, 10));

const lookup: {[key: string]: number} = {};
const predictLifecycle = (fish: Fish, days: number): number => {
  const lookupKey = `${fish}-${days}`;
  if (lookupKey in lookup) {
    return lookup[lookupKey];
  }

  let totalFish = 1;

  if (days <= 0) {
    return 0;
  }

  while (days > 0) {
    days = days - fish;

    fish = 7;

    totalFish += predictLifecycle(9, days);
  }

  lookup[lookupKey] = totalFish;

  return totalFish;
}

const part1 = (rawInput: string) => {
  const fishes = parseInput(rawInput);

  return fishes.reduce((prevValue, fish) => prevValue + predictLifecycle(fish, 80), 0);
};

const part2 = (rawInput: string) => {
  const fishes = parseInput(rawInput);

  return fishes.reduce((prevValue, fish) => prevValue + predictLifecycle(fish, 256), 0);
};

run({
  part1: {
    tests: [
      //{ input: `3,4,3,1,2`, expected: 10 },
      { input: `3,4,3,1,2`, expected: 5934 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `3,4,3,1,2`, expected: 26984457539 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
