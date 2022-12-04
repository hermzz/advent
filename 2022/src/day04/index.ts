import run from "aocrunner";

type Range = {
  start:number,
  end: number
}

type Section = [Range, Range];

const parseRange = (input: string): Range => {
  const [ start, end ] = input.split("-");
  return { start: parseInt(start), end: parseInt(end) };
}
const parseInput = (rawInput: string): Section[] =>
  rawInput.split("\n").map(line => {
    const elem = line.split(",");
    return [ parseRange(elem[0]), parseRange(elem[1]) ];
  });

const isContainedWithin = (r1: Range, r2: Range): boolean =>
  r1.start <= r2.start && r1.end >= r2.end;

const someOverlap = (r1: Range, r2: Range): boolean =>
  isContainedWithin(r1, r2) ||
  isContainedWithin(r2, r1) || // I think this is needed but tests pass without it...
  (r1.start >= r2.start && r1.start <= r2.end) ||
  (r1.end >= r2.start && r1.end <= r2.end);

const part1 = (rawInput: string) => 
  parseInput(rawInput)
  .filter(section => isContainedWithin(section[0], section[1]) || isContainedWithin(section[1], section[0]))
  .length;

const part2 = (rawInput: string) =>
  parseInput(rawInput)
  .filter(section => someOverlap(section[0], section[1]))
  .length;
;

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
