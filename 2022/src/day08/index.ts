import run from "aocrunner";
import "../utils/index.js"

enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right"
};

const parseInput = (rawInput: string): [number, number[]] => 
  [rawInput.split("\n")[0].length, rawInput.replaceAll("\n", "").split("").map(c => parseInt(c))];

type GetElement = (input: number[], width: number, index: number) => number[];
const getElements: Record<Direction, GetElement> = {

  "Up": (input: number[], width: number, index: number): number[] => {
    const mod = index % width;
    return input.slice(0, index).filter((_v, i) => i % width == mod).reverse();
  },

  "Down": (input: number[], width: number, index: number): number[] => {
    const mod = index % width;
    return input.slice(Math.ceil(index / width) * width).filter((_v, i) => i % width == mod);
  },

  "Left": (input: number[], width: number, index: number): number[] => 
    input.slice(Math.floor(index / width) * width, index).reverse(),

  "Right": (input: number[], width: number, index: number): number[] =>
    input.slice(index + 1, Math.ceil(index / width) * width),
}

const shorterThan = (input: number[], width: number, index: number): boolean => 
  Object.keys(getElements).some(direction => {
    return getElements[direction as Direction](input, width, index).every(el => input[index] > el);
  });

const part1 = (rawInput: string) => {
  const [width, input] = parseInput(rawInput);
  
  return input.filter((_curr, i) => {
    if (i < width || i >= (input.length - width) || i % width == 0 || i % width == width - 1) {
      // Skip edges
      return true;
    }

    return shorterThan(input, width, i);
  }).length;
};

const part2 = (rawInput: string) => {
  const [width, input] = parseInput(rawInput);

  return input.reduce((prev, curr, i) => {
    if (i < width || i >= (input.length - width) || i % width == 0 || i % width == width - 1) {
      // Skip edges since at least one side will be 0
      return prev;
    }

    const res = Object.keys(getElements).reduce((prevEl, currEl) => {
      const elements: number[] = getElements[currEl as Direction](input, width, i);
      const treeHit = elements.findIndex(e => e >= curr);
      return prevEl * (treeHit >= 0 ? treeHit + 1 : elements.length);
    }, 1);

    return res > prev ? res : prev;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390`,
        expected: 21,
      },

    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
