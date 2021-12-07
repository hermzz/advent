import run from "aocrunner";

type Rule = {
  min: number,
  max: number,
  character: string
}

type Password = {
  rule: Rule,
  text: string
}

const parseInput = (rawInput: string): Password[] => rawInput.split("\n").map(line => {
  const matches = line.match(/([0-9]+)-([0-9]+) ([a-z]): ([a-z]+)/);
  if (!matches) {
    throw Error(`Line "${line}" did not match`);
  }

  return {rule: {min: parseInt(matches[1], 10), max: parseInt(matches[2], 10), character: matches[3]}, text: matches[4]}
});

const isValidCount = (password: Password): boolean => {
  const matches = [...password.text.matchAll(new RegExp(`${password.rule.character}`, 'g'))];

  return matches.length >= password.rule.min && matches.length <= password.rule.max;
}

const xor = (a: boolean, b: boolean): boolean => (a || b) && !(a && b);

const isValidPosition = (password: Password): boolean => xor(
  password.text[password.rule.min - 1] === password.rule.character,
  password.text[password.rule.max - 1] === password.rule.character
);

const part1 = (rawInput: string) => parseInput(rawInput).filter(password => isValidCount(password)).length;
const part2 = (rawInput: string) => parseInput(rawInput).filter(password => isValidPosition(password)).length;

run({
  part1: {
    tests: [
      {
        input: `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
2-12 l: lrllllllllllll`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
