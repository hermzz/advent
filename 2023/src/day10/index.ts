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
  (buildLoop(parseInput(rawInput)).length + 1) / 2
;

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  console.log(grid);

  const loop = buildLoop(grid);

  const rows = loop.reduce((pv: number[], v: Coord): number[] => pv.indexOf(v[0]) > -1 ? pv : pv.concat(v[0]), []);
  console.log(rows);

// F 7 L J | -

  const pairs = rows.map(i =>
      loop
        .reduce((pv: Coord[], v: Coord) => v[0] == i ? pv.concat([v]) : pv, [])
        .sort((a: Coord, b: Coord) => a[1] - b[1])
        .reduce(([inside, count]: [boolean, number], c: Coord): [boolean, number] => {
          const currChar = grid[c[0]][c[1]];
          console.log(`${c} => ${currChar}`);
          if (inside) {
            if (currChar == '-') {
              return [ inside, count];
            } else if (currChar == '|') {
              return [ false, count ];
            }
          }
          return [false, 0];
        }, [false, 0])
        /*.reduce((pv: Coord[][], v: Coord): Coord[][] => {
          if (pv.length == 0) {
            return [[ v ]];
          }

          const lastGroup = pv[ pv.length - 1 ];
          const lastElem = lastGroup[ lastGroup.length - 1 ];

          if (grid[v[0]][v[1]] == 'S') {
            if (['-', 'L', 'F'].indexOf(grid[v[0]][v[1]-1]) > -1) {
              lastGroup.push(v);
              return pv;
            }
          } else if (grid[v[0]][v[1]] != 'F' && grid[v[0]][v[1]] != 'L') {
            lastGroup.push(v);
            return pv;
          }

          pv.push([v]);
          return pv;
        }, [])*/
      );

  pairs.map(p => console.log(p));

  let sum = 0;
  /*pairs.forEach(pair => {
    let previousGroup = pair.shift()!;
    pair.forEach(group => {
      sum += group[0][1] - previousGroup[previousGroup.length - 1][1];
      previousGroup = group;
    });
  });*/

  return sum;
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
      /*{
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
        expected: 10,
      },*/
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
