import run from "aocrunner";
import "../utils/index.js"

type Noop = {};
type Addx = { value: number };
type Command = Noop | Addx;

const parseInput = (rawInput: string): Command[] => rawInput.split("\n").map(line => {
  let cmd: Command;
  if (line === 'noop') {
    cmd = {};
  } else if (line.startsWith('addx')) {
    const [, value] = line.split(" ");
    cmd = { value: parseInt(value) };
  };

  return cmd!;
});

const part1 = (rawInput: string) => {
  let results: number[] = [];
  let commands = parseInput(rawInput);
  let cycleCheck = [20, 60, 100, 140, 180, 220];

  let cycle = 0;
  let currValue = 1;
  commands.forEach((command, i) => {
    cycle += 'value' in command ? 2 : 1;

    if (cycle >= cycleCheck[0]) {
      results.push(currValue * cycleCheck[0]);
      cycleCheck.shift();
    }

    currValue += 'value' in command ? command.value : 0;
  });

  return results.reduce((prev, curr) => prev + curr, 0);
};

const part2 = (rawInput: string) => {
  let commands = parseInput(rawInput);

  const buffer: boolean[] = Array(240).fill(false);

  let cycle = 0;
  let currValue = 1;
  let wait = 0;
  let command: Command | null = null;

  while(commands.length > 0) {
    if (cycle % 40 <= currValue + 1 && cycle % 40 >= currValue - 1) {
      buffer[cycle] = true;
    }

    if (!command) {
      command = commands.shift()!;
      wait = 'value' in command! ? 1 : 0;
    }

    if (wait == 0) {
      currValue += ('value' in command! ? command.value : 0);
      command = null;
    }

    wait -= 1;
    cycle = (cycle + 1) % 240;
  }

  buffer.map(b => b ? '#' : '.').chunks(40).forEach(line => {
    line.forEach(c => process.stdout.write(c));
    process.stdout.write("\n");
  });

  return 'ECZUZALR';
};

run({
  part1: {
    tests: [
      {
        input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: 'ECZUZALR',
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
