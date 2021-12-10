import run from "aocrunner";

const segmentNames = <const> ["a", "b", "c", "d", "e", "f", "g"];
type SegmentName = typeof segmentNames[number];
type Display = string[];

type DisplayMapType = {
  [Property in SegmentName]: SegmentName
};
type DisplayMap = DisplayMapType;

type Entry = {
  inputs: Display[],
  outputs: Display[]
};

const stringToDisplay = (input: string): Display =>
  input.split("").map(c => c as SegmentName).sort();

const parseInput = (rawInput: string): Entry[] => rawInput.split("\n").map(entry => {
  const [inputs, outputs] = entry.split(" | ");
  return { inputs: inputs.split(" ").map(stringToDisplay), outputs: outputs.split(" ").map(stringToDisplay) };
});

const part1 = (rawInput: string) => parseInput(rawInput).reduce((prevValue, entry) =>
    prevValue + entry.outputs.reduce((pv, output) => pv + ([2, 4, 3, 7].indexOf(output.length) !== -1 ? 1 : 0), 0), 0
);

// Given a bunch of inputs, it figures out what each segment in the display maps to
const decodeInputs = (inputs: Display[], combos: readonly SegmentName[][]): DisplayMap => {
  for (const combo of combos) {
    const map = {
      a: combo[0],
      b: combo[1],
      c: combo[2],
      d: combo[3],
      e: combo[4],
      f: combo[5],
      g: combo[6]
    };

    if (inputs.every(input => applyMap(input, map) >= 0)) {
      return map;
    }
  };

  throw new Error('Not found');
};

const generateCombos = (names: readonly SegmentName[], res: SegmentName[], index: number): readonly SegmentName[][] => {
  if (res.length == names.length) {
    return [ res as SegmentName[] ];
  }

  return names
    .filter(char => res.indexOf(char) === -1)
    .map(char => generateCombos(names, res.concat(char), index + 1))
    .reduce((pv, v) => pv.concat(v), []);
}

const combos = generateCombos(segmentNames, [], 0);

// Given a display it applies the map and returns the number it represents
const applyMap = (display: Display, map: DisplayMap): number =>
  getNumber(display.map(c => map[c as SegmentName]).sort().join(""));

const getNumber = (segments: string): number =>
  ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'].indexOf(segments);

const calculateEntry = (entry: Entry, map: DisplayMap): number =>
  parseInt(entry.outputs.map(display => applyMap(display, map)).join(""), 10);

const part2 = (rawInput: string) =>
  parseInput(rawInput).reduce((prevValue, entry) =>
    prevValue + calculateEntry(entry, decodeInputs(entry.inputs, combos)),
  0);

run({
  part1: {
    tests: [
      { input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`, expected: 26 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`, expected: 61229 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
