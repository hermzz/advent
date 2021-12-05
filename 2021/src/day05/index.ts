import run from "aocrunner";

type Point = {
  x: number,
  y: number
};
type Axis = "x" | "y"; 

type Line = {
  start: Point,
  end: Point
};

type Grid = number[][];

const parseInput = (rawInput: string): Line[] => {
  return rawInput.split("\n").map(line => {
    const parts = line.split(' -> ');

    return {
      start: {x: parseInt(parts[0].split(",")[0], 10), y: parseInt(parts[0].split(",")[1], 10)},
      end: {x: parseInt(parts[1].split(",")[0], 10), y: parseInt(parts[1].split(",")[1], 10)}
    };
  });
};

const calcMaxDimension = (lines: Line[], axis: Axis): number =>
  lines.reduce((prevValue, line) => Math.max(line.start[axis], line.end[axis], prevValue), 0) + 1;

const createGrid = (lines: Line[]): Grid => {
  return Array.from(
    {length: calcMaxDimension(lines, "y")},
    () => Array.from(
      {length: calcMaxDimension(lines, "x")}, () => 0
    )
  );
};

const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

const lineRange = (line: Line, axis: Axis): number[] => 
  range(Math.min(line.start[axis], line.end[axis]), Math.max(line.start[axis], line.end[axis]));

const applyLine = (line: Line, grid: Grid): Grid =>
  line.start.x === line.end.x || line.start.y == line.end.y ? applyLineWithDiagonals(line, grid) : grid ;

const matchRanges = (rangeA: number[], rangeB: number[]): number[] =>
  rangeA.length === 1 ? Array.from({length: rangeB.length}, () => rangeA[0]) : rangeA;

const applyLineWithDiagonals = (line: Line, grid: Grid): Grid => {
  let rangeX = lineRange(line, "x");
  let rangeY = lineRange(line, "y");

  if (line.start.x > line.end.x) {
    rangeX = rangeX.reverse()
  }

  if (line.start.y > line.end.y) {
    rangeY = rangeY.reverse();
  }

  rangeX = matchRanges(rangeX, rangeY);
  rangeY = matchRanges(rangeY, rangeX);

  rangeX.map((_v, i) => grid[rangeY[i]][rangeX[i]] += 1);

  return grid;
};

const applyLines = (lines: Line[], grid: Grid, func: (line: Line, grid: Grid) => Grid): Grid =>
  lines.reduce((prevValue, line) => func(line, prevValue), grid);

const countOverlaps = (grid: Grid): number =>
  grid.reduce((prevValue, line) => prevValue + line.reduce((pv, point) => point > 1 ? pv + 1 : pv, 0), 0);

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  return countOverlaps(applyLines(lines, createGrid(lines), applyLine));
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  return countOverlaps(applyLines(lines, createGrid(lines), applyLineWithDiagonals));
};

run({
  part1: {
    tests: [
      { input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`, expected: 5 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`, expected: 12 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
