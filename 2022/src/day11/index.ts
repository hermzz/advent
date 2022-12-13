import run from "aocrunner";
import "../utils/index.js"

type Inspection = (old: number) => number;

type Monkey = {
  items: number[],
  inspect: Inspection,
  test: number,
  true_target: number,
  false_target: number
  inspect_counter: number
}

const coolDown = (value: number): number => Math.floor(value / 3);
const isDivisibleBy = (value: number, by: number): boolean => value % by == 0;

const parseInput = (rawInput: string): Monkey[] => rawInput.split("\n").chunks(7).map(lines => {
  return {
    items: lines[1].slice(18).split(", ").map(n => parseInt(n)),
    inspect: new Function('old', `return ${lines[2].slice(19)}`) as Inspection,
    test: parseInt(lines[3].slice(21)),
    true_target: parseInt(lines[4].slice(-1)),
    false_target: parseInt(lines[5].slice(-1)),
    inspect_counter: 0
  };
});

const part1 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);

  Array(20).fill(null).forEach(_value => {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const newItem = coolDown(monkey.inspect(item));
        const targetMonkey = isDivisibleBy(newItem, monkey.test) ? monkey.true_target : monkey.false_target;

        monkeys[targetMonkey].items.push(newItem);

        monkey.inspect_counter += 1;

      });
      monkey.items = [];
    });
  });

  monkeys.sort((a: Monkey, b: Monkey) => b.inspect_counter - a.inspect_counter);

  return monkeys[0].inspect_counter * monkeys[1].inspect_counter;
};

const part2 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);
  const divisors = monkeys.reduce((prev, curr) => prev * curr.test, 1);

  for (let i = 0; i < 10_000; i++) {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const newItem = monkey.inspect(item) % divisors;
        const targetMonkey = isDivisibleBy(newItem, monkey.test) ? monkey.true_target : monkey.false_target;

        monkeys[targetMonkey].items.push(newItem);

        monkey.inspect_counter += 1;

      });
      monkey.items = [];
    });
  };

  monkeys.sort((a: Monkey, b: Monkey) => b.inspect_counter - a.inspect_counter);

  return monkeys[0].inspect_counter * monkeys[1].inspect_counter;
};

run({
  part1: {
    tests: [
      {
        input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
