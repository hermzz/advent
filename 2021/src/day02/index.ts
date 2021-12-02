import run from "aocrunner";

enum Directions {
  "forward",
  "up",
  "down"
};
type DirectionKeys = keyof typeof Directions

type Command = {
  direction: Directions,
  amount: number
};
type Commands = Command[];

type Position = {
  horizontal: number,
  depth: number,
  aim: number
}

const parseInput = (rawInput: string): Commands => {
  return rawInput.split("\n").map((line: string): Command => {
    const components = line.split(" ");

    const direction= Directions[components[0] as DirectionKeys];
    const amount = parseInt(components[1]);

    return {direction, amount};
  });
};

const calculatePosition = (commands: Commands, initialPosition?: Position): Position => {
  let position = {horizontal: 0, depth: 0, aim: 0};
  if (initialPosition) {
    position = {...initialPosition};
  }

  commands.forEach((command: Command) => {
    if (command.direction === Directions.forward) {
      position.horizontal += command.amount;
    } else if (command.direction === Directions.up) {
      position.depth -= command.amount;
    } else if (command.direction === Directions.down) {
      position.depth += command.amount;
    }
  });

  return position;
}

const calculatePositionWithAim = (commands: Commands, initialPosition?: Position): Position => {
  let position = {horizontal: 0, depth: 0, aim: 0};
  if (initialPosition) {
    position = {...initialPosition};
  }

  commands.forEach((command: Command) => {
    if (command.direction === Directions.forward) {
      position.horizontal += command.amount;
      position.depth += position.aim * command.amount;
    } else if (command.direction === Directions.up) {
      position.aim -= command.amount;
    } else if (command.direction === Directions.down) {
      position.aim += command.amount;
    }
  });

  return position;
}

const part1 = (rawInput: string) => {
  const commands = parseInput(rawInput);
  const position = calculatePosition(commands);

  return position.depth * position.horizontal;
};

const part2 = (rawInput: string) => {
  const commands = parseInput(rawInput);
  const position = calculatePositionWithAim(commands);

  return position.depth * position.horizontal;
};

run({
  part1: {
    tests: [
      { input: `forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2`, expected: 150 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `forward 5\ndown 5\nforward 8\nup 3\ndown 8\nforward 2`, expected: 900 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
