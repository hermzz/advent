import run from "aocrunner";

const parseInput = (rawInput: string): string[] => rawInput.split("\n");

const zeroCharCode = '0'.charCodeAt(0);
const nineCharCode = '9'.charCodeAt(0);
const findFirstNumber = (line: string, reverse: boolean = false): string => {
  if (reverse) {
    let chars = line.split("");
    chars.reverse();
    line = chars.join("");
  }

  for (let i = 0; i < line.length; i++) {
    if (line.charCodeAt(i) >= zeroCharCode && line.charCodeAt(i) <= nineCharCode) {
      return line.charAt(i);
    }
  }

  throw new Error("Could not find any numbers");
}

const replacementMap: Record<string, RegExp> = {
  'o1e': new RegExp(/one/g),
  't2o': new RegExp(/two/g),
  't3e': new RegExp(/three/g),
  'f4r': new RegExp(/four/g),
  'f5e': new RegExp(/five/g),
  's6x': new RegExp(/six/g),
  's7n': new RegExp(/seven/g),
  'e8t': new RegExp(/eight/g),
  'n9e': new RegExp(/nine/g)
};

const replaceNumbers = (line: string): string => {
  for (let i in replacementMap) {
    line = line.replace(replacementMap[i], i);
  }

  return line;
}

const part1 = (rawInput: string) => 
  parseInput(rawInput)
    .map(line => parseInt(findFirstNumber(line) + findFirstNumber(line, true)))
    .reduce((pv, n) => pv + n, 0)
;

const part2 = (rawInput: string) =>
  parseInput(rawInput)
    .map(line => replaceNumbers(line))
    .map(line => parseInt(findFirstNumber(line) + findFirstNumber(line, true)))
    .reduce((pv, n) => pv + n, 0)
;

run({
  part1: {
    tests: [
      {
        input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`,
        expected: 281,
      },
      {
        input: `1fiveeight`,
        expected: 18
      },
      {
        input: `twone`,
        expected: 21
      },
      {
        input: `eighthree`,
        expected: 83
      },
      {
        input: `sevenine`,
        expected: 79
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
