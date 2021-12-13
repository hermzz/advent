import run from "aocrunner";

type Octopus = number;
type Grid = Octopus[][];

const parseInput = (rawInput: string): Grid => rawInput.split("\n").map(line => line.split("").map(n => parseInt(n, 10)));

const onTopEdge = (_grid: Grid, _x: number, y: number) => y === 0;
const onLeftEdge = (_grid: Grid, x: number, _y: number) => x === 0;
const onRightEdge = (grid: Grid, x: number, y: number) => x === grid[y].length - 1;
const onBottomEdge = (grid: Grid, _x: number, y: number) => y === grid.length - 1;

const flashNeighbours = (grid: Grid, x: number, y: number): Grid => {
  if (!onTopEdge(grid, x, y)) {
    if (!onLeftEdge(grid, x, y)) {
      grid[y-1][x-1] += 1;
    }
    grid[y-1][x] += 1;
    if (!onRightEdge(grid, x, y)) {
      grid[y-1][x+1] += 1;
    }
  }

  if (!onLeftEdge(grid, x, y)) {
    grid[y][x-1] += 1;
  }

  if (!onRightEdge(grid, x, y)) {
    grid[y][x+1] += 1;
  }

  if (!onBottomEdge(grid, x, y)) {
    if (!onLeftEdge(grid, x, y)) {
      grid[y+1][x-1] += 1;
    }
    grid[y+1][x] += 1;
    if (!onRightEdge(grid, x, y)) {
      grid[y+1][x+1] += 1;
    }
  }

  return grid;
}

const gridPlusOne = (grid: Grid): Grid => grid.map(line => line.map(octopus => octopus + 1));
const stepGrid = (grid: Grid): Grid => {
  const hasFlashed: string[] = [];
  let hasNewFlashes: boolean;
  grid = gridPlusOne(grid);

  do {
    hasNewFlashes = false;
    grid.forEach((line, y) => line.forEach((octopus, x) => {
      const flashKey = `${y}-${x}`;
      if (octopus > 9 && hasFlashed.indexOf(flashKey) === -1) {
        hasFlashed.push(flashKey);
        grid = flashNeighbours(grid, x, y);
        hasNewFlashes = true;
      }
    }));
  } while (hasNewFlashes);

  for (let flashKey of hasFlashed) {
    const [y, x] = flashKey.split("-").map(n => parseInt(n, 10));
    grid[y][x] = 0;
  }

  return grid;
};

const countFlashes = (grid: Grid): number =>
  grid.reduce((prevValue, line) => prevValue + line.reduce((pv, octopus) => pv + (octopus === 0 ? 1 : 0), 0), 0);

const part1 = (rawInput: string) => {
  let grid = parseInput(rawInput);

  return Array
    .from({length: 100})
    .map(_i => {
      grid = stepGrid(grid);
      return countFlashes(grid);
    })
    .reduce((totalFlashes, flashes) => totalFlashes + flashes, 0);
};

const part2 = (rawInput: string) => {
  let grid = parseInput(rawInput);
  let step = 1;

  while (true) {
    grid = stepGrid(grid);
    if (countFlashes(grid) === grid.length * grid[0].length) {
      return step;
    }

    step += 1;
  };
};

run({
  part1: {
    tests: [
      { input: `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`, expected: 1656 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`, expected: 195 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
