import run from "aocrunner";

type Crate = string;
type Stack = Crate[];
type Container = Stack[];

type Instruction = {
  n: number,
  from: number,
  to: number
};

declare global {
  interface Array<T> {
    chunks<T>(this: T[], size: number): T[][];
  }
}

Array.prototype.chunks = function chunks<T>(this: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < this.length; i += size) {
    output.push(this.slice(i, i + size));
  }
  return output;
}

const parseInstruction = (line: string): Instruction => {
  const [ _a, n, _b, from, _c, to ] = line.split(" ");
  return { n: parseInt(n), from: parseInt(from) - 1, to: parseInt(to) - 1 };
}

const parseInputStack = (rawLines: string): Container => {

  const lines = rawLines.split("\n");
  const container: Container = Array((lines[0].length + 1) / 4).fill(null).map(_e => new Array());

  lines.forEach(line => {
    line.split("").chunks(4).map((v, i) => {
      if (v[1] != ' ') {
        container[i].unshift(v[1]);
      }
    })
  });

  return container;
}

const crateMover9000 = (container: Container, instruction: Instruction): Container => {
  container[instruction.from].splice(instruction.n * -1).reverse().forEach(x => container[instruction.to].push(x));
  return container;
}

const crateMover9001 = (container: Container, instruction: Instruction): Container => {
  container[instruction.from].splice(instruction.n * -1).forEach(x => container[instruction.to].push(x));
  return container;
}

const parseInput = (rawInput: string): [Container, Instruction[]] => {
  const [inputStack, inputInstructions] = rawInput.split("\n\n");

  return [
    parseInputStack(inputStack),
    inputInstructions.split("\n").map(parseInstruction)
  ];
};

const part1 = (rawInput: string) => {
  let [container, instructions] = parseInput(rawInput);

  instructions.forEach(instruction => { container = crateMover9000(container, instruction) });

  return container.map(stack => stack.slice(-1)[0]).join("");
};

const part2 = (rawInput: string) => {
  let [container, instructions] = parseInput(rawInput);

  instructions.forEach(instruction => { container = crateMover9001(container, instruction) });

  return container.map(stack => stack.slice(-1)[0]).join("");
};

run({
  part1: {
    tests: [
      {
        input:`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input:`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
