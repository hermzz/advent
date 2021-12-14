import run from "aocrunner";
import { match } from "assert";

type Point = {
  x: number,
  y: number
};
type Grid = Point[];
type FullGrid = boolean[][];

type Axis = "y" | "x";
type Instruction = {
  axis: Axis,
  line: number
}

const parseInput = (rawInput: string): [Grid, Instruction[]] => {
  const grid: Grid = [];
  const instructions: Instruction[] = [];
  rawInput.split("\n").forEach(line => {
    const gridMatches = line.match(/([0-9]+),([0-9]+)/)
    if (gridMatches) {
      grid.push({x: parseInt(gridMatches[1], 10), y: parseInt(gridMatches[2], 10)});
    }

    const instructionMatches = line.match(/fold along (y|x)=([0-9]+)/)
    if (instructionMatches) {
      instructions.push({axis: instructionMatches[1] as Axis, line: parseInt(instructionMatches[2])});
    }
  });

  return [grid, instructions];
};

const pointInGrid = (point: Point, grid: Grid): boolean => grid.filter(p => p.x === point.x && p.y === point.y).length > 0;

const max = (grid: Grid, plane: "x"|"y"): number => grid.reduce((pv, p) => p[plane] > pv ? p[plane] : pv, 0) + 1;

const createGrid = (grid: Grid): FullGrid => {
  const maxX = max(grid, "x");
  const maxY = max(grid, "y");

  return Array.from({length: maxY}).map((_v, y) =>
    Array.from({length: maxX}).map((_v, x) => pointInGrid({x, y}, grid)));
}

const printGrid = (grid: FullGrid) => {
  console.log(grid.map(line => line.map(p => p ? '#' : '.').join("")).join("\n"));
  console.log(Array.from({length: grid[0].length}, _v => ['-']).join(""));
}

const doFold = (fold: Instruction, grid: Grid): Grid => {
  grid.map(p => {
    if (p[fold.axis] > fold.line) {
      p[fold.axis] = fold.line * 2 - p[fold.axis];
    }
  });

  return grid.filter((point, i) => !grid.slice(i+1).reduce((pv: boolean, p) => pv || (p.x === point.x && p.y === point.y), false));
};

const spliceGrid = (grid: FullGrid, amount: number): FullGrid => grid.map(line => line.splice(0, amount));

const part1 = (rawInput: string) => {
  let [grid, instructions] = parseInput(rawInput);

  grid = doFold(instructions[0], grid);

  return grid.length;
};

const matchRow = (row: boolean[], matches: boolean[]) => matches.reduce((pv, m, i) => pv && m === row[i], true);

const gridToLetter = (grid: FullGrid): string => {
  if (grid[0].every(v=>v)) {
    return 'O';
  } else if (matchRow(grid[0], [false, true, true, false])) {
    return 'G';
  } else if (grid[0].slice(0, 4).every(v => v) && grid[5].slice(0, 4).every(v => v)) {
    return 'Z';
  } else if (grid[5].slice(0, 4).every(v => v) && grid[1][0]) {
    return 'L';
  } else if (matchRow(grid[0], [true, true, true, false]) && matchRow(grid[2], [true, true, true, false])) {
    return 'B';
  } else if (matchRow(grid[0], [true, false, false, true])) {
    return 'H';
  } else if (matchRow(grid[3], [true, false, false, false]) && matchRow(grid[4], [true, false, false, false]) && matchRow(grid[5], [true, false, false, false])) {
    return 'F';
  } else if (matchRow(grid[0], [true, true, true, false]) && matchRow(grid[3], [true, true, true, false]) && matchRow(grid[5], [true, false, false, false])) {
    return 'P';
  } else if (matchRow(grid[0], [true, true, true, false]) && matchRow(grid[3], [true, true, true, false]) && matchRow(grid[5], [true, false, false, true])) {
    return 'R'
  }

  return '';
  /*
.##..####.#....###..#..#.####.###.
#..#....#.#....#..#.#..#.#....#..#
#......#..#....###..####.###..#..#
#.##..#...#....#..#.#..#.#....###.
#..#.#....#....#..#.#..#.#....#...
.###.####.####.###..#..#.#....#...
   */
}

const part2 = (rawInput: string) => {
  let [grid, instructions] = parseInput(rawInput);

  for (let fold of instructions) {
    grid = doFold(fold, grid);
  }

  const fullGrid = createGrid(grid);
  let letters = '';
  while (fullGrid[0].length) {
    const letterGrid = spliceGrid(fullGrid, 5);
    letters += gridToLetter(letterGrid);
  }

  return letters;
};

run({
  part1: {
    tests: [
      { input: `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`, expected: 17 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`, expected: "O" },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
