import run from "aocrunner";
import "../utils/index.js"

const parseInput = (rawInput: string): string[] => rawInput.split("");

const uniqueChars = (chars: string[]): boolean => {
  return chars.reduce((acc, curr, i) => acc || chars.slice(i + 1).indexOf(curr) > -1, false);
}

const findDistinctCharacters = (chars: string[], n: number) => chars.findIndex((_el, i, input) => {
  if (i + n > input.length) {
    return false;
  }

  return !uniqueChars(input.slice(i, i + n));
}) + n;

const part1 = (rawInput: string) => findDistinctCharacters(parseInput(rawInput), 4);

const part2 = (rawInput: string) => findDistinctCharacters(parseInput(rawInput), 14);

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 6,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 10,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 23,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 23,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 29,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
