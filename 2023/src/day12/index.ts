import run from "aocrunner";

type SpringCondition = "." | "#" | "?"
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

type ReduceAcc = [ SpringCondition, number[] ];
const isViable = (springs: SpringCondition[], check: number[]): boolean => {
  const compareCheck = springs.reduce(
    ([ prevChar, acc ]: ReduceAcc, s: SpringCondition): ReduceAcc => {
      if (s == '#') {
        if (prevChar == '.') {
          acc.push(0);
        }

        acc[acc.length - 1] += 1;
      }

      prevChar = s;
      return [ prevChar, acc ];
    },
    [ '.', [] ]
  )[1];

  if (compareCheck.length != check.length) {
    return false;
  }

  return compareCheck.reduce((pv, v, i) => pv && v == check[i], true);
}

const recursiveCount = (accCheck: number[], prevChar: SpringCondition, springs: SpringCondition[], check: number[], q: number[]): number => {
  console.log(`q`, q);
  if (q.length == 0) {
    console.log(`acccheck`, accCheck);
    console.log(`remaining sp`, springs);
    return isViable(springs, check) ? 1 : 0;
  }

  console.log(`springs`, springs);

  const advance = q[0]+1;
  const preChunk = springs.slice(0, q[0]);
  console.log(`pre`, preChunk);
  for (let c of preChunk) {
    if (c == '#') {
      if (prevChar == '.') {
        accCheck.push(0);
      }

      accCheck[accCheck.length - 1] += 1;
      prevChar = c;
    }
  }

  const newQ = q.slice(1).map(q => q - preChunk.length - 1);

  return (
    recursiveCount(accCheck.map(n => n), prevChar, springs.slice(advance), check, newQ) +
    recursiveCount(accCheck.map(n => n), prevChar, springs.slice(advance), check, newQ)
  );
};

const countArrangements = (record: ConditionRecord): number => {
  //console.log(record.springs);
  const questionable = record.springs.map((v, i) => i).filter(i => record.springs[i] == '?');
  //console.log(questionable);

  const res = recursiveCount([], '.', record.springs, record.check, questionable);
  //console.log(res);

  return res;
};

const part1 = (rawInput: string) => 
  parseInput(rawInput)
    .map(r => countArrangements(r))
    .reduce((pv, v) => pv + v, 0)
  ;

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

// https://github.com/AlexPTerry/AdventOfCode2023/blob/main/day_12/part2.py
run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3`,
/*.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,*/
        expected: 1,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
