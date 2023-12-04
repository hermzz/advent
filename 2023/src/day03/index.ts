import run from "aocrunner";
import { finished } from "stream";

type Grid = number[][];
type NumberMatch = {
  n: number,
  symbols: Symbol[]
}
type Symbol = {
  s: string;
  i: number;
  j: number;
};

const parseInput = (rawInput: string) => rawInput.split("\n").map(line => line.split(""));

const isIn = (symbols: Symbol[], symbol: Symbol): boolean => symbols.reduce((pv, v) => pv || (v.i == symbol.i && v.j == symbol.j), false);

const extractNumbers = (grid: Grid): NumberMatch[]=> {
  let numbers: NumberMatch[] = [];
  let currNumber = null;
  let symbols = [];
  for (let i = 0; i < grid.length; i++) {
    currNumber = null;
    symbols = []
    for (let j = 0; j < grid[0].length; j++) {
      if (!currNumber && isNumber(grid, i, j)) {
        currNumber = grid[i][j];
        posNextToSymbol(grid, i, j).forEach(symbol => { if (!isIn(symbols, symbol)) { symbols.push(symbol); }});
      } else if (currNumber && isNumber(grid, i, j)) {
        currNumber += grid[i][j];
        posNextToSymbol(grid, i, j).forEach(symbol => { if (!isIn(symbols, symbol)) { symbols.push(symbol); }});
      } else if (currNumber && !isNumber(grid, i, j)) {
        if (symbols.length > 0) {
          numbers.push({n: currNumber, symbols});
        }
        currNumber = null;
        symbols = [];
      }
    }

    if (currNumber && symbols.length > 0) {
      numbers.push({n: currNumber, symbols});
    }
  }

  return numbers;
}

const isNumber = (grid: string[][], i: number, j: number): boolean =>
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(grid[i][j]) >= 0
;

const isSymbol = (grid: string[][], i: number, j: number): boolean =>
  grid[i][j] != '.' && !isNumber(grid, i, j);
;

const posNextToSymbol = (grid: string[][], i: number, j: number): Symbol[] => {
  let i_range = [0];
  if (i > 0) {
    i_range.push(-1);
  }

  if (i < grid.length - 1) {
    i_range.push(1);
  }

  let j_range = [0];
  if (j > 0) {
    j_range.push(-1);
  }
  
  if (j < grid[i].length - 1) {
    j_range.push(1);
  }

  const symbols: Symbol[] = []
  for (const i_check of i_range) {
    for (const j_check of j_range) {
      if (isSymbol(grid, i + i_check, j + j_check)) {
        symbols.push({s: grid[i + i_check][j + j_check], i: i + i_check, j: j + j_check});
      }
    }
  }

  return symbols
};

const part1 = (rawInput: string) =>
  extractNumbers(parseInput(rawInput))
    .reduce((pv, v) => pv + parseInt(v.n), 0);

const part2 = (rawInput: string) => {
  const coords: Record<string, number[]> = {};
  extractNumbers(parseInput(rawInput))
    .forEach(match => match.symbols.forEach(symbol => {
      if (symbol.s == '*') {
        const key = `${symbol.i}-${symbol.j}`
        if (coords[key]) {
          coords[key].push(match.n)
        } else {
          coords[key] = [match.n];
        }
      }
    })
  );

  return Object
    .keys(coords)
    .filter(key => coords[key].length == 2)
    .reduce((pv, v) => pv + coords[v].reduce((pi, n) => pi * parseInt(n), 1) ,0)
  ;
};

run({
  part1: {
    tests: [
      {
        input: `
467..114..
...*......
..35...633
*......#..
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35...633
*......#..
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
