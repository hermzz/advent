import run from "aocrunner";

type Molecule = string;
type Template = Molecule[];
type Insertion = {
  first: Molecule,
  second: Molecule,
  molecule: Molecule
}

type Counter = {
  [key: string]: number;
}

const parseInput = (rawInput: string): [Template, Insertion[]] => {
  let template: Template = [];
  let insertion: Insertion[] = [];
  for (let line of rawInput.split("\n")) {
    if (line.match(/^[A-Z]+$/)) {
      template = line.split("");
    }

    const matches = line.match(/^([A-Z]+) -> ([A-Z])/);
    if (matches) {
      const [first, second] = matches[1].split("");
      insertion.push({
        first, second, molecule: matches[2]
      })
    }
  }

  return [template, insertion];
};

const runInsertion = (template: Template, insertion: Insertion[], rounds: number): Counter => {
  let counter: Counter = {};
  
  for (let i = 0; i < template.length - 1; i++) {
    const key = template[i] + template[i+1];
    counter[key] = (counter[key] || 0) + 1;
  }

  for (let i = 0; i < rounds; i++) {
    let newCounter: Counter = {};
    for (let key in counter) {
      const [left, right] = key.split("");
      const rule = insertion.find(v => v.first == left && v.second == right);

      if (!rule) {
        newCounter[key] += counter[key];
        continue;
      }

      const leftKey = left + rule.molecule;
      const rightKey = rule.molecule + right;
      newCounter[leftKey] = (newCounter[leftKey] || 0) + counter[key];
      newCounter[rightKey] = (newCounter[rightKey] || 0) + counter[key];
    }

    counter = newCounter;
  }

  return counter;
}

const getTotals = (counter: Counter): Counter => {
  const totals: Counter = {};
  for (let key in counter) {
    const [_left, right] = key.split("");
    if (totals[right]) {
      totals[right] += counter[key];
    } else {
      totals[right] = counter[key];
    }
  }

  return totals;
}

const calculateMostLeastCommon = (counter: Counter): number => 
  Math.max(...Object.values(counter)) - Math.min(...Object.values(counter));

const part1 = (rawInput: string) => {
  let [template, insertion] = parseInput(rawInput);

  const counter = runInsertion(template, insertion, 10);
  const totals = getTotals(counter);
  totals[template[0]] += 1;

  return calculateMostLeastCommon(totals);
};

const part2 = (rawInput: string) => {
  let [template, insertion] = parseInput(rawInput);

  const counter = runInsertion(template, insertion, 40);
  const totals = getTotals(counter);
  totals[template[0]] += 1;

  return calculateMostLeastCommon(totals);
};

run({
  part1: {
    tests: [
      { input: `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`, expected: 1588 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`, expected: 2188189693529 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
