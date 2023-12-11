import run from "aocrunner";

type Coord = [ number, number ];

const parseInput = (rawInput: string): Coord[] => 
  rawInput
    .split("\n")
    .map((line, i) =>
      line
        .split("")
        .map((char, j): [ string, number ] => [ char, j ])
        .filter(([char, j]) => char == '#')
        .map(([, j]) => j)
    )
    .reduce((pv: Coord[], v, i): Coord[] => pv.concat(v.map(j => [i, j])), []);

const getMaxCoord = (coords: Coord[], d: number): number =>
  coords.reduce((pv, c) => c[d] > pv ? c[d] : pv, 0);

const coordHasIndex = (coords: Coord[], i: number, d: number): boolean => 
  coords.reduce((pv, c) => pv || c[d] == i, false);

const calculateEmptyDimension = (coords: Coord[], dimension: number) =>
  [...Array(getMaxCoord(coords, dimension)).keys()].map((v, i) => i).filter(i => !coordHasIndex(coords, i, dimension))

const countPreviousEmpty = (empty: number[], c: Coord, d: number) =>
  empty.filter(n => c[d] > n).length;

const expand = (coords: Coord[], expansion: number): Coord[] => {
  const emptyRows = calculateEmptyDimension(coords, 0);
  const emptyColumns = calculateEmptyDimension(coords, 1);

  return coords.map(c => [
    c[0] + (countPreviousEmpty(emptyRows, c, 0) * expansion),
    c[1] + (countPreviousEmpty(emptyColumns, c, 1) * expansion)
  ]);
}

const distanceBetween = (c1: Coord, c2: Coord): number => 
  Math.max(c1[0], c2[0]) - Math.min(c1[0], c2[0]) +
  Math.max(c1[1], c2[1]) - Math.min(c1[1], c2[1])
;

const part1 = (rawInput: string) => {
  const coords = expand(parseInput(rawInput), 1);
  return coords.reduce((acc, c1, i) => acc + coords.slice(i).reduce((acc2, c2) => acc2 + distanceBetween(c1, c2), 0), 0);
};

const part2 = (rawInput: string) => {
  const coords = expand(parseInput(rawInput), 99);
  return coords.reduce((acc, c1, i) => acc + coords.slice(i).reduce((acc2, c2) => acc2 + distanceBetween(c1, c2), 0), 0);
};

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 8410,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
