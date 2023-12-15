import run from "aocrunner";

type Command = string;
const parseInput = (rawInput: string): Command[] => rawInput.split(",");

const hash = (c: Command): number =>
  c.split("").reduce((pv, char) => ((pv + char.charCodeAt(0)) * 17) % 256, 0);

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map(c => hash(c))
    .reduce((pv, v) => pv + v, 0);

type Box = Lens[];
type Lens = { name: string, focal: number };

const deleteLens = (lens: Lens[], label: string) => lens.filter(l => l.name != label);

const part2 = (rawInput: string) =>
  parseInput(rawInput)
    .reduce((boxes: Box[], command: Command) => {
      if (command.endsWith('-')) {
        const label = command.slice(0, -1);
        const boxIndex = hash(label);
        boxes[boxIndex] = deleteLens(boxes[boxIndex], label);
      } else {
        const [ label, focal ] = command.split("=");
        const boxIndex = hash(label);
        const lensIndex = boxes[boxIndex].reduce((ri, lens, i) => lens.name == label ? i : ri, -1);
        if (lensIndex > -1) {
          boxes[boxIndex][lensIndex].focal = parseInt(focal);
        } else {
          boxes[boxIndex].push({
            name: label,
            focal: parseInt(focal)
          });
        }
      }

      return boxes;
    }, [...Array(256)].map(() => []))
    .reduce(
      (totalSum: number, box: Box, i: number) =>
        totalSum + box.reduce((focalSum, lens, j) => focalSum + ((i + 1) * (j + 1) * lens.focal), 0),
      0
    )
;

run({
  part1: {
    tests: [
      {
        input: `HASH`,
        expected: 52,
      },
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
