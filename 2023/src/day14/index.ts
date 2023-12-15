import run from "aocrunner";

type Coord = [ number, number ];

enum Direction {
  Up = "Up",
  Left = "Left",
  Right = "Right",
  Down = "Down"
}

type ParseArgs = [ Coord[], Coord[] ];
const parseInput = (rawInput: string): [ ParseArgs, number, number ] =>
  [ rawInput.split("\n").reduce(
    ([roundAcc, squareAcc]: ParseArgs, line, i) => {
      const [ round, square ] = line.split("").reduce(
        ([roundAcc2, squareAcc2]: ParseArgs, char, j) => {
          if (char == 'O') {
            return [ roundAcc2.concat([[i, j]]), squareAcc2 ];
          } else if (char == '#') {
            return [ roundAcc2, squareAcc2.concat([[i, j]]) ];
          }

          return [ roundAcc2, squareAcc2 ];
        },
        [[], []]);

      return [ roundAcc.concat(round), squareAcc.concat(square) ];
    },
    [[], []]
  ), rawInput.split("\n").length, rawInput.split("\n")[0].length ];

const calculateLoad = (rocks: Coord[], height: number): number =>
  rocks.reduce((pv, r) => pv + (height - r[0]), 0);

const rocksOnAxis = (r: Coord[], axis: number, key: number): Coord[] =>
  r.filter(r2 => r2[axis] == key);

type Comp = (a: number, b: number, eq: boolean) => boolean;
const lt = (a: number, b: number, eq = false) => eq ? a <= b : a < b;
const gt = (a: number, b: number, eq = false) => eq ? a >= b : a > b;

const ConfigMap: Record<Direction, (height: number, width: number) => [ number, number, number, number, number, Comp ]> = {
  // axis, nonAxis, edge, limitAdd, axisLength, comp
  'Up': (h, w) => [ 0, 1, 0, 1, w + 1, lt], 
  'Down': (h, w) => [ 0, 1, h, -1, w + 2, gt],
  'Left': (h, w) => [ 1, 0, 0, 1, h + 1, lt],
  'Right': (h, w) => [ 1, 0, w, -1, h + 2, gt]
}

const moveRocks = (round: Coord[], square: Coord[], direction: Direction, height: number, width: number): Coord[] => {
  const [ axis, nonAxis, edge, limitAdd, axisLength, comp ] = ConfigMap[direction](height, width);

  const changes: [ Coord, Coord ][] = [];
  [...Array(axisLength)].forEach((v, i) => {
    const squareAxis = rocksOnAxis(square, nonAxis, i);
    const roundAxis = rocksOnAxis(round, nonAxis, i);

    roundAxis.forEach(r => {
      const squaresBetweenEdge = squareAxis.filter(s => comp(s[axis], r[axis], false)).map(s => s[axis]);
      const limit = squaresBetweenEdge.length > 0 ? squaresBetweenEdge.reduce((pv, s) => comp(pv, s, false) ? s : pv, edge) + limitAdd : edge ;
      const column = roundAxis.filter(r2 => comp(limit, r2[axis], true) && comp(r2[axis], r[axis], false));

      changes.push([r, [
          axis == 0 ? (limit + ( column.length * limitAdd )) : r[0],
          axis == 1 ? (limit + ( column.length * limitAdd )) : r[1]
      ] as Coord]);
    });
  });
  
  return round.map(c => {
    for (let [ from, to ] of changes) {
      if (c[0] == from[0] && c[1] == from[1]) {
        return to;
      }
    }
    return c;
  });
};

const part1 = (rawInput: string) => {
  let [ [ round, square ], height, width ] = parseInput(rawInput);
  return calculateLoad(moveRocks(round, square, Direction.Up, height-1, width-1), height);
};

const cache: Record<string, [number, number]> = {};
const part2 = (rawInput: string) => {
  let [ [ round, square ], height, width ] = parseInput(rawInput);
  
  const target = 1_000_000_000;
  for (let i = 0; i < target; i++) {

    const key = round.sort((a,b) => {
      if (a[0] == b[0]) {
        return a[1] - b[1];
      }
      return a[0] - b[0];
    }).map(c => c.join(",")).join(";");

    round = [Direction.Up, Direction.Left, Direction.Down, Direction.Right]
      .reduce((round, direction) => moveRocks(round, square, direction, height-1, width-1), round)
    ;

    const load = calculateLoad(round, height);
    if (key in cache) {
      const cacheHit = cache[key][0];
      const predictedLoad = (target - i -  1) % (i - cacheHit) + cacheHit;
      return Object.keys(cache).reduce((pv, key) => cache[key][0] == predictedLoad ? cache[key][1] : pv, 0);
    }

    cache[key] = [ i, load ];
  }

  return calculateLoad(round, height);
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
