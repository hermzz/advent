import run from "aocrunner";

const SpringConditions = {
  Operational: '.',
  Damaged: '#',
  Unknown: '?'
} as const;

type SpringCondition = typeof SpringConditions[keyof typeof SpringConditions];
type ConditionRecord = {
  springs: SpringCondition[],
  check: number[]
}

const parseInput = (rawInput: string): ConditionRecord[] => rawInput.split("\n").map(line => {
  const elem = line.split(" ");
  return {
    springs: elem[0].split("") as SpringCondition[],
    check: elem[1].split(",").map(n => parseInt(n))
  };
});

type Cache = Record<string, number>;
const countArrangementsInner = (springs: SpringCondition[], counts: number[], cache: Cache): number => {
  if (counts.length == 0) {
    return springs.indexOf(SpringConditions.Damaged) > -1 ? 0 : 1 ;
  }

  if (springs.length < counts.reduce((pv, v) => pv + v, 0) + counts.length) {
    return 0;
  }

  const cacheKey = `${counts.length - 1}-${springs.length - 1}`;
  if (cacheKey in cache) {
    return cache[cacheKey];
  }

  let arrangements = 0;
  if (springs[0] != SpringConditions.Damaged) {
    arrangements += countArrangementsInner(springs.slice(1), counts, cache);
  }

  const nextGroupSize = counts[0];
  if (springs.slice(0, nextGroupSize).indexOf(SpringConditions.Operational) == -1 && springs[nextGroupSize] != SpringConditions.Damaged) {
    arrangements += countArrangementsInner(springs.slice(nextGroupSize + 1), counts.slice(1), cache);
  }

  cache[cacheKey] = arrangements;

  return arrangements;
};

const countArrangements = (springs: SpringCondition[], counts: number[]): number => {
  springs.push(SpringConditions.Operational);
  return countArrangementsInner(springs, counts, {});
};

const part1 = (rawInput: string) => 
  parseInput(rawInput)
    .map(r => countArrangements(r.springs, r.check))
    .reduce((pv, v) => pv + v, 0)
  ;

// needed this to figure it out https://nickymeuleman.netlify.app/garden/aoc2023-day12
const part2 = (rawInput: string) =>
  parseInput(rawInput)
    .map(r => {
      return {
        springs: [...Array(5)].map(() => r.springs.join("")).join("?").split("") as SpringCondition[],
        check: [...Array(5)].reduce((pv) => pv.concat(r.check), [])
      };
    })
    .map(r => countArrangements(r.springs, r.check))
    .reduce((pv, v) => pv + v, 0)
;

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
