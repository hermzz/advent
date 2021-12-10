import run from "aocrunner";

type Point = {
  x: number,
  y: number,
  depth: number
};
type Grid = Point[][];
type Basin = Point[];

const parseInput = (rawInput: string): Grid =>
  rawInput.split("\n").map((line, y) =>
    line.split("").map((depth, x) => { return {x, y, depth: parseInt(depth, 10)}; }));

const isLowPoint = (grid: Grid, y: number, x: number) =>
  (x === 0 || grid[y][x].depth < grid[y][x-1].depth) &&
  (x === grid[y].length - 1 || grid[y][x].depth < grid[y][x+1].depth) &&
  (y === 0 || grid[y][x].depth < grid[y-1][x].depth) &&
  (y === grid.length - 1 || grid[y][x].depth < grid[y+1][x].depth);

const getLowPoints = (grid: Grid): Point[] =>
  grid.map((line, i) =>
    line.filter((_p, j) => isLowPoint(grid, i, j))).flat();

const getBasin = (grid: Grid, startPoint: Point): Basin => {
  const basin: Basin = [startPoint];

  let foundNeighbours = true;
  while (foundNeighbours) {
    foundNeighbours = false;
    for (const point of basin) {
      for (const neighbour of getHeigherNeighbours(grid, point)) {
        if (!pointInBasin(neighbour, basin)) {
          foundNeighbours = true;  
          basin.push(neighbour);
        }
      }
    }
  }

  return basin;
};

const getNeighbours = (grid: Grid, point: Point): Point[] => [
  point.x > 0 ? grid[point.y][point.x - 1] : null,
  point.x < grid[point.y].length - 1 ? grid[point.y][point.x + 1] : null,
  point.y > 0 ? grid[point.y - 1][point.x] : null,
  point.y < grid.length - 1 ? grid[point.y + 1][point.x] : null,
].filter((p): p is Point => p !== null);

const getHeigherNeighbours = (grid: Grid, point: Point): Point[] => 
  getNeighbours(grid, point).filter(neighbour => neighbour.depth !== 9 && point.depth < neighbour.depth);

const pointInBasin = (point: Point, basin: Basin): boolean =>
  basin.reduce((found: boolean, checkPoint: Point) => found || point == checkPoint, false);

const part1 = (rawInput: string) =>
  getLowPoints(parseInput(rawInput)).reduce((prevValue, point) => prevValue + point.depth + 1, 0);

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const basins: Basin[] = [];

  for (const point of getLowPoints(grid)) {
    if (basins.some(basin => pointInBasin(point, basin))) {
      continue;
    }

    basins.push(getBasin(grid, point));
  }

  basins.sort((a, b) => b.length - a.length);

  return basins.slice(0, 3).reduce((prevValue, basin) => prevValue * basin.length, 1);
};

run({
  part1: {
    tests: [
      { input: `2199943210
3987894921
9856789892
8767896789
9899965678`, expected: 15 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `2199943210
3987894921
9856789892
8767896789
9899965678`, expected: 1134 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
