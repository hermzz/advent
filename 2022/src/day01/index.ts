import run from "aocrunner";

type CaloryGroup = number[][];

const parseInput = (rawInput: string) => {
  const calories: CaloryGroup = [];
  let accumulator: number[] = [];

  rawInput.split("\n").forEach(v => {

    if (v == '') {
      calories.push(accumulator);
      accumulator = [];
      return;
    }

    accumulator.push(parseInt(v));
  });

  calories.push(accumulator);

  return calories;
}

const calcTotal = (calories: number[]): number => calories.reduce((prev, curr) => prev + curr, 0);

const findMaxCalories = (calories: CaloryGroup): number => 
  calories.reduce((prev, curr) => {
    const total = calcTotal(curr);
    return prev = total > prev ? total : prev;
  }, 0);

const sortDesc = (calories: CaloryGroup): CaloryGroup => {
  calories.sort((c1, c2) => calcTotal(c2) - calcTotal(c1));
  return calories;
}

const getTopGroups = (calories: CaloryGroup, n: number): number[][] => 
  sortDesc(calories)
  .slice(0, n);

const part1 = (rawInput: string) => findMaxCalories(parseInput(rawInput));

const part2 = (rawInput: string) => getTopGroups(parseInput(rawInput), 3)
  .reduce((prev, curr) => prev + calcTotal(curr), 0)
;

run({
  part1: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
