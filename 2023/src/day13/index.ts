import run from "aocrunner";

type MirrorRow = string;
type Mirror = MirrorRow[];

const parseInput = (rawInput: string): Mirror[] =>
  rawInput
    .split("\n")
    .reduce(
      ([reflections, reflection]: [ Mirror[], Mirror ], line: string, i: number, lines: string[]): [ Mirror[], Mirror ] => {
        if (line == "" || i == lines.length - 1) {
          if (line != "") {
            reflection.push(line);
          }
          reflections.push(reflection);
          reflection = [];
        } else {
          reflection.push(line);
        }

        return [ reflections, reflection ];
      },
      [[], []]
    )[0]
;

const checkReflection = (mirror: Mirror): boolean => {
  if (mirror.length == 1) {
    return true;
  }

  return [...Array(Math.floor(mirror.length/2))].reduce((pv, _cv, ci) =>
    pv && mirror[ci] == mirror[mirror.length - ci - 1],
    true
  );
};

const allMatches = (mirror: Mirror, line: string): number[] =>
  mirror.reduce((pv: number[], target, i) => {
    if (line == target) {
      pv.push(i)
    }
    return pv;
  }, []);

const getReflectionLine = (mirror: Mirror, ignore: number|null = null): number =>
  mirror.reduce((pv, line, i) => {
    if (i == mirror.length - 1) {
      return pv;
    }

    if (i == 0) {
      const matchLines = allMatches(mirror.slice(1), line);

      for (let matchLine of matchLines) {
        if (((matchLine + 1) % 2 != 0) && checkReflection(mirror.slice(1, matchLine+1))) {
          const res = (matchLine + 2) / 2;

          if (!ignore || res != ignore) {
            return res;
          }
        }
      }
    }

    // only accept ranges that can be split evenly
    if ((mirror.length - 1 - i) % 2 == 0) {
      return pv;
    }

    const matchLine = mirror[mirror.length - 1] == line;
    if (matchLine && checkReflection(mirror.slice(i))) {
      const res = (mirror.length + i) / 2;

      if (!ignore || res != ignore) {
        return res;
      }
    }

    return pv;
  }, 0);

const transpose = (mirror: Mirror): Mirror => {
  return [...Array(mirror[0].length)].map((v, i) => 
    [...Array(mirror.length)].map((v2, j) => mirror[j][i]).join("")
  );
}

const getSmudgeReflectionLine = (mirror: Mirror, ignore: number): number =>
{
  const jRange = [...Array(mirror[0].length)].map((v, i) => i);

  for (let i of mirror.keys()) {
    for (let j in jRange) {
      const jInt = parseInt(j);
      const newRow = mirror[i].slice(0, jInt) + (mirror[i].charAt(jInt) == '.' ? '#' : '.') + mirror[i].slice(jInt + 1);

      const newRowMatch = mirror.indexOf(newRow);
      if (newRowMatch > -1) {
        const res = getReflectionLine(
          [...Array(mirror.length)].map((f, index) => index == i ? newRow : mirror[index]),
          ignore
        );
        
        if (res > 0) {
          return res;
        }
      }
    }
  }

  return 0;
}

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map(mirror => getReflectionLine(mirror) * 100 + getReflectionLine(transpose(mirror)))
    .reduce((pv, v) => pv + v, 0)
;

const part2 = (rawInput: string) =>
  parseInput(rawInput)
    .map(mirror => {
      const transposed = transpose(mirror);
      const [ res, tRes ] = [ getReflectionLine(mirror), getReflectionLine(transposed) ];

      return getSmudgeReflectionLine(mirror, res) * 100 + getSmudgeReflectionLine(transposed, tRes);
    })
    .reduce((pv, v) => pv + v, 0)
;

run({
  part1: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 405,
      },
      {
        input: `#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 300,
      },
      {
        input:
`##..##..###
...#..#....
...#..#....
.###..##...
.#......#..
.#......#..
##..##..###
..#.##.#...
.##....##..
.###..##...
.########..`,
        expected: 10,
      },
      {
        input: `###..##
.##..##
###..##
###.###
#.###..
#..##..
.#...##`,
      expected: 6,
      },
      {
        input: `
#..#.#..#.#
....#....#.
###..#..#..
#..##.##.##
####.#..#.#
.##.#.##.#.
####.#..#.#`,
      expected: 7,
      },
      {
        input: `#.###...#.....##.
##.##.###...#..##
###..###..#####.#
###..###..#.###.#
##.##.###...#..##
#.###...#.....##.
##..##..#....#...
..#......#.##..#.
..#......#.##..#.
##..##..#....#...
#.###...#.....##.
##.##.###...#..##
###..###..#.###.#
###..###..#####.#
##.##.###...#..##
#.###...#.....##.
##....##..####...`,
      expected: 800,
      },
      {
        input: `#..#.#..#.#
....#....#.
###..#..#..
#..##.##.##
####.#..#.#
.##.#.##.#.
####.#..#.#`,
        expected: 7
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 400,
      },
      {
        input: `##.#.#####.....
##...##.###.###
##...##.###.###
##.#.#####.....
.##...#.#...#..
##..#...#..##..
###.######....#
.##.######..###
#...#...###....
..#.....#.##...
....#......#.##`,
        expected: 14
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
