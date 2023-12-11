import run from "aocrunner";

type Grid = string[][];
type Coord = [ number, number ];

enum Direction {
  Up = "Up",
  Left = "Left",
  Right = "Right",
  Down = "Down"
}

const PositionMap: Record<Direction, (i: number, j: number) => Coord> = {
  'Up': (i: number, j: number) => [ i-1, j ],
  'Down': (i: number, j: number) => [ i+1, j ],
  'Left': (i: number, j: number) => [ i, j-1 ],
  'Right': (i: number, j: number) => [ i, j+1 ],
}

const DirectionMap: Record<string, Record<string, Direction>> = {
  'F': {
    'Up': Direction.Right,
    'Left': Direction.Down
  },
  '7': {
    'Up': Direction.Left,
    'Right': Direction.Down
  },
  'L': {
    'Down': Direction.Right,
    'Left': Direction.Up
  },
  'J': {
    'Down': Direction.Left,
    'Right': Direction.Up
  },
  '-': {
    'Right': Direction.Right,
    'Left': Direction.Left
  },
  '|': {
    'Up': Direction.Up,
    'Down': Direction.Down
  },
}

const parseInput = (rawInput: string) => rawInput.split("\n").map(line => line.split(""));

const findStart = (grid: Grid): Coord => grid.reduce((pgv, line, i) => {
  const j = line.reduce((plv, c, j) => c == 'S' ? j : plv, -1);
  if (j != -1) {
    return [ i, j ];
  }

  return pgv;
}, [ -1, -1 ]);

const findStartDirection = (grid: Grid, i: number, j: number): Direction => {
  for(let dir of [Direction.Up, Direction.Left, Direction.Right, Direction.Down]) {
    const [ newI, newJ ] = PositionMap[dir](i, j);

    if (newI < 0 || newJ < 0 || newI >= grid.length || newJ >= grid[0].length) {
      continue;
    }

    const newPos = grid[newI][newJ];

    if (Object.keys(DirectionMap).indexOf(newPos) == -1) {
      continue;
    }

    if (Object.keys(DirectionMap[grid[newI][newJ]]).indexOf(dir) > -1) {
      return dir;
    }
  }

  throw new Error(`No dir found for i: ${i}, j: ${j}`);
}

const buildLoop = (grid: Grid): Coord[] => {
  const loop: [number, number][] = [];
  const [ i, j ] = findStart(grid);
  let newDir = findStartDirection(grid, i, j);
  const startDir = newDir;

  loop.push([ i ,j ]);

  let [ newI, newJ ] = PositionMap[newDir](i, j);
  while (grid[newI][newJ] != 'S') {
    loop.push([ newI, newJ ]);
    newDir = DirectionMap[grid[newI][newJ]][newDir];
    [ newI, newJ ] = PositionMap[newDir](newI, newJ);
  }

  for (let char of Object.keys(DirectionMap)) {
    if (DirectionMap[char][newDir] && DirectionMap[char][newDir] == startDir) {
      grid[newI][newJ] = char;
    }
  }

  return loop;
}

const part1 = (rawInput: string) =>
  Math.floor((buildLoop(parseInput(rawInput)).length + 1) / 2)
;

type AccType = [ boolean, number, number ];
const countRowEnclosed = (row: string[], loopIndexes: number[]): number =>
  row.reduce(([inside, count, prevIndex]: AccType, currChar: string, currIndex: number): AccType => {
    if (loopIndexes.indexOf(currIndex) == -1) {
      return [ inside, count, prevIndex ];
    }

    if (currChar == '|') {
      count += inside ? (currIndex - prevIndex - 1) : 0;
      inside = !inside;
      prevIndex = currIndex;
    } else if (['L', 'F'].indexOf(currChar) > -1) {
      count += inside ? (currIndex - prevIndex - 1) : 0;
      prevIndex = currIndex;
    } else if (['7', 'J'].indexOf(currChar) > -1) {
      if ((currChar == '7' && row[prevIndex] == 'L') || (currChar == 'J' && row[prevIndex] == 'F')) {
        inside = !inside;
      }

      prevIndex = currIndex;
    }

    return [ inside, count, prevIndex ];
  }, [false, 0, 0])[1];

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const loop = buildLoop(grid);
  return grid.reduce((rowSum, row, i) => rowSum + countRowEnclosed(row, loop.filter(c => c[0] == i).map(c => c[1])), 0);
};

run({
  part1: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
      {
        input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
