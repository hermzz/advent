import run from "aocrunner";

type Compartment = number[];
type Rucksack = number[];

const charToPriority = (char: string): number => {
  const res = char.charCodeAt(0);
  return (res >= 97) ? res - 96 : res - 38;
};

const parseInput = (rawInput: string): Rucksack[] =>
  rawInput.split("\n").map(line => line.split("").map(charToPriority));

const rucksackCompartments = (rucksack: Rucksack): Compartment[] => [
  rucksack.slice(0, rucksack.length / 2),
  rucksack.slice(rucksack.length / 2)
];

const findCommonItems = (r1: number[], r2: number[]) => r1.filter(o => r2.some(p => o == p));

const part1 = (rawInput: string) =>
  parseInput(rawInput)
  .map(rucksackCompartments)
  .map(r => findCommonItems(r[0], r[1]))
  .reduce((prev, curr) => prev + curr[0], 0)
;

const part2 = (rawInput: string) => {
  const groups: Rucksack[][] = [];

  parseInput(rawInput).forEach((r, i) => {
    if (groups.length == Math.floor(i / 3)) {
      groups.push([]);
    }

    groups[Math.floor(i / 3)].push(r);
  });

  return groups.map(group => findCommonItems(findCommonItems(group[0], group[1]), group[2]))
    .reduce((prev, curr) => prev + curr[0], 0);
};

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
