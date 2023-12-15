import run from "aocrunner";

type Reflector = string[];
const parseInput = (rawInput: string): Reflector => rawInput.split("\n");

const calculateLoad = (reflector: Reflector): number =>
  reflector.reduce((acc, row, i) => acc + ((reflector.length - i) * row.split("").filter(c => c == 'O').length), 0);

const transpose = (reflector: Reflector): Reflector => {
  return [...Array(reflector[0].length)].map((_v, i) => 
    [...Array(reflector.length)].map((_v2, j) => reflector[j][i]).join("")
  );
}

const moveRocks = (reflector: Reflector): Reflector =>
  transpose(reflector).map((row, i) => 
    row
      .split("#")
      .map(group =>
        group
          .split("")
          .sort((a,b) => b.codePointAt(0)! - a.codePointAt(0)!)
        .join("")
      )
      .join("#")
  )
;

const invert = (reflector: Reflector): Reflector =>
  reflector.map(line => line.split("").reverse().join(""));

const splitKey = (s: string, l: number) =>
  [...Array(s.length / l)].map((_v, i) => s.slice(i*l, (i*l)+l));

const spin = (reflector: Reflector): Reflector => 
  [...Array(4)].reduce((prevReflector) => invert(moveRocks(prevReflector)), reflector);

const part1 = (rawInput: string) =>
  calculateLoad(transpose(moveRocks(parseInput(rawInput))));

const part2 = (rawInput: string) => {
  let reflector = parseInput(rawInput);

  const cache: string[] = [];
  cache.push(reflector.join(""));
  
  const target = 1_000_000_000;
  for (let i = 0; i < target; i++) {
    reflector = spin(reflector);

    const key = reflector.join("")
    const cacheHit = cache.indexOf(key);
    if (cacheHit > -1) {
      const predictedLoad = ((target - cacheHit) % (i + 1 - cacheHit)) + cacheHit;
      return calculateLoad(splitKey(cache[predictedLoad], reflector.length));
    }

    cache.push(key);
  }
};

run({
  part1: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
