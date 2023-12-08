import run from "aocrunner";

type Branch = {
  L: string,
  R: string
}
type Nodes = Record<string, Branch>;
type Input = {
  instructions: string[],
  nodes: Nodes
}

const node_regex = /(?<node>[0-9A-Z]+) = \((?<left>[0-9A-Z]+), (?<right>[0-9A-Z]+)\)/;

const parseInput = (rawInput: string): Input => {
  const lines = rawInput.split("\n");
  const instructions = lines.shift()!.split("");

  lines.shift();

  const nodes: Nodes = {};
  lines.forEach(line => {
    const groups = line.match(node_regex)!.groups!;

    nodes[groups['node']] = { L: groups['left'], R: groups['right'] };
  });

  return { instructions, nodes };
};

const countStepsTo = (currNode: string, input: Input, endCondition: (currNode: string) => boolean): number => {
  let steps = 0;
  while (!endCondition(currNode)) {
    const i = input.instructions[ steps % input.instructions.length ];
    const node = input.nodes[currNode];

    currNode = i == 'L' ? node.L : node.R;
    steps += 1;
  }
  return steps;
}

const part1 = (rawInput: string) => countStepsTo('AAA', parseInput(rawInput), currNode => currNode == 'ZZZ');

const gcd = (a: number, b: number): number => b ? gcd(b, a %b) : Math.abs(a);
const lcm = (a: number, b: number): number => a * (b / gcd(a, b));

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return Object.keys(input.nodes)
    .filter(n => n.endsWith('A'))
    .map(currNode => countStepsTo(currNode, input, currNode => currNode.endsWith('Z')))
    .reduce((pv, n) => lcm(pv, n), 1)
  ;
};

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
