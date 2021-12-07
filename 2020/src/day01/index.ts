import run from "aocrunner";

const parseInput = (rawInput: string): number[] => rawInput.split("\n").map(n => parseInt(n, 10));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return Array.from(input, (_v, i) => i)
    .map(i => Array.from({length: input.length - i - 1}, (_v, j) => [input[i], input[i + j]]))
    .flat()
    .reduce((prevValue, value) => {
      return prevValue != 0 ? prevValue : (value[0] + value[1] == 2020 ? value[0] * value[1] : 0)
    }
    , 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return Array.from(input, (_v, i) => i)
    .map(i => Array.from({length: input.length - i - 1}, (_v, j) => i + j)
        .map(j => Array.from({length: input.length - j - 1}, (_v, k) => [input[i], input[j], input[j + k]])).flat()
    )
    .flat()
    .reduce((prevValue, value) => {
      return prevValue != 0 ? prevValue : (value[0] + value[1] + value[2] == 2020 ? value[0] * value[1] * value[2] : 0)
    }
    , 0);
};

run({
  part1: {
    tests: [
      { input: `1721
979
366
299
675
1456`, expected: 514579, },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `1721
979
366
299
675
1456`, expected: 241861950, },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
