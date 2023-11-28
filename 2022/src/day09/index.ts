import run from "aocrunner";
import "../utils/index.js"

enum Dir {
  U = "U",
  D = "D",
  L = "L",
  R = "R"
};

type Move = {
  dir: Dir, 
  num: number
};

type Coord = [number, number]; // x, y
type DoMove = (hPos: Coord) => Coord;
const doMove: Record<Dir, DoMove> = {
  "U": (hPos: Coord): Coord => [hPos[0] + 1, hPos[1]],
  "D": (hPos: Coord): Coord => [hPos[0] - 1, hPos[1]],
  "L": (hPos: Coord): Coord => [hPos[0], hPos[1] - 1],
  "R": (hPos: Coord): Coord => [hPos[0], hPos[1] + 1],
};

type DoFollow = (hPos: Coord, tPos: Coord) => Coord;
const doFollow: Record<Dir, DoFollow> = {
  "U": (hPos: Coord, tPos: Coord): Coord => {
    if (hPos[0] > tPos[0] && hPos[0] - tPos[0] > 1) {
      tPos[0] = hPos[0] - 1;
      if (hPos[1] != tPos[1]) {
        tPos[1] = Math.max(tPos[1], hPos[1]) - Math.min(tPos[1], hPos[1]) + 1;
      }
    }
    return tPos;
  },
  "D": (hPos: Coord, tPos: Coord): Coord => {
    if (hPos[0] < tPos[0] && tPos[0] - hPos[0] > 1) {
      tPos[0] = hPos[0] + 1;
      if (hPos[1] != tPos[1]) {
        tPos[1] = Math.max(tPos[1], hPos[1]) - Math.min(tPos[1], hPos[1]) + 1;
      }
    }
    return tPos;
  },
  "L": (hPos: Coord, tPos: Coord): Coord => {
    if (hPos[1] < tPos[1] && tPos[1] - hPos[1] > 1) {
      tPos[1] = hPos[1] + 1;
      if (hPos[0] != tPos[0]) {
        tPos[0] = Math.max(tPos[0], hPos[0]) - Math.min(tPos[0], hPos[0]) + 1;
      }
    }
    return tPos;
  },
  "R": (hPos: Coord, tPos: Coord): Coord => {
    if (hPos[1] > tPos[1] && hPos[1] - tPos[1] > 1) {
      tPos[1] = hPos[1] - 1;
      if (hPos[0] != tPos[0]) {
        tPos[0] = Math.max(tPos[0], hPos[0]) - Math.min(tPos[0], hPos[0]) + 1;
      }
    }
    return tPos;
  },
};

const parseInput = (rawInput: string): Move[] => rawInput.split("\n").map(line => {
  const elem = line.split(" ");
  return {dir: elem[0] as Dir, num: parseInt(elem[1])};
});

const printStatus = (steppedOn: Record<string, number>, hPos: Coord, tPosSet: Coord[]) => {
  Array(30).fill(null).forEach((_v, i) => {
    Array(30).fill(null).forEach((_w, j) => {
      if (hPos[0]+15 == i && hPos[1]+15 == j) {
        process.stdout.write('H');
      } else if (tPosSet.some(c => c[0] + 15 == i && c[1] + 15 == j)) {
        process.stdout.write('L');
      } else if (`${i+15}-${j+15}` in steppedOn) {
        process.stdout.write('#');
      } else {
        process.stdout.write('.');
      }
    });
    process.stdout.write("\n");
  });
    process.stdout.write("\n");
}

const part1 = (rawInput: string) => {
  const steppedOn: Record<string, number> = {
    '0-0': 1
  };

  // x, y
  let hPos: Coord = [0, 0];
  let tPos: Coord = [0, 0];

  parseInput(rawInput).forEach(move => {
    for (let i = 0; i < move.num; i++) {
      hPos = doMove[move.dir](hPos);
      tPos = doFollow[move.dir](hPos, tPos);

      const tPosKey = `${tPos[0]}-${tPos[1]}`;
      if (!(tPosKey in steppedOn)) {
        steppedOn[tPosKey] = 0;
      }

      steppedOn[tPosKey] += 1;
    }

      printStatus(steppedOn, hPos, [tPos]);
  });

  return Object.keys(steppedOn).length;
};

const part2 = (rawInput: string) => {
  const steppedOn: Record<string, number> = {
    '0-0': 1
  };

  // x, y
  let hPos: Coord = [0, 0];
  let tPosSet: Coord[]= Array(9).fill(null).map(_x => [0, 0]);

  parseInput(rawInput).forEach(move => {
    console.log(`Move ${move.dir}: ${move.num}`);
    for (let i = 0; i < move.num; i++) {
      hPos = doMove[move.dir](hPos);
      tPosSet.forEach((tPos, tPosIndex) => {
        tPosSet[tPosIndex] = doFollow[move.dir](tPosIndex == 0 ? hPos : tPosSet[tPosIndex - 1], tPos)  
      });

      const tPosKey = `${tPosSet[8][0]}-${tPosSet[8][1]}`;
      if (!(tPosKey in steppedOn)) {
        steppedOn[tPosKey] = 0;
      }

      steppedOn[tPosKey] += 1;
      printStatus(steppedOn, hPos, tPosSet);
    }

    console.log(tPosSet);
    console.log(steppedOn);
  });

  return Object.keys(steppedOn).length;
};

run({
  part1: {
    tests: [
      /*{
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 13,
      },*/
    ],
    solution: part1,
  },
  part2: {
    tests: [
      /*{
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 1,
      },*/
      {
        input: `R 5
U 8`
/*L 8
D 3
R 17
D 10
L 25
U 20`*/,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
