import run from "aocrunner";

type Square = {
  number: number,
  selected: boolean
};

type Board = Square[][];

const parseDraws = (line: string): number[] => line.split(",").map(n => parseInt(n, 10));
const parseBoards = (blocks: string[][]): Board[] =>
  blocks.map(block =>
    block.map(row =>
      row.replace(/^\s?([0-9]+)\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)$/, "$1 $2 $3 $4 $5").split(" ").map(n => {
        return { number: parseInt(n, 10), selected: false }
      })));

const createBoardChunks = (lines: string[], n: number): string[][] => lines.length ? [lines.slice(0, n), ...createBoardChunks(lines.slice(n + 1), n)] : [];

const parseInput = (rawInput: string): [number[], Board[]] => {
  let lines = rawInput.split("\n");

  return [
    parseDraws(lines.shift()!),
    parseBoards(createBoardChunks(lines.slice(1), 5))
  ];
};

const applyDraw = (board: Board, draw: number) =>
  board.map(row =>
    row.map(square => {
      return { number: square.number, selected: square.selected || square.number === draw }
    }));

const isWinner = (board: Board): boolean => board.some(row => row.every(square => square.selected)) ||
  Array.from({length: 5}, (_v, index) => index).some(index => board.every(row => row[index].selected));

const getBoardScore = (board: Board): number =>
  board.reduce((prevValue, row) =>
    prevValue += row.reduce((pv, square) => {
      return pv += !square.selected ? square.number : 0;
    }, 0), 0);

const getWinningBoards = (boards: Board[], draws: number[]): [Board, number][] => {
  let winningBoards: [Board, number][] = [];
  draws.forEach(draw => {
    boards = boards.map(board => {
      board = applyDraw(board, draw);
      if (isWinner(board)) {
        winningBoards.push([board, draw]);
        return;
      }

      return board;
    }).filter((board): board is Board => !!board);
  });

  return winningBoards;
};

const part1 = (rawInput: string) => {
  const [draws, boards] = parseInput(rawInput);
  const [board, draw] = getWinningBoards(boards, draws).shift()!;

  return getBoardScore(board) * draw;
};

const part2 = (rawInput: string) => {
  const [draws, boards] = parseInput(rawInput);
  const [board, draw] = getWinningBoards(boards, draws).pop()!;

  return getBoardScore(board) * draw;
};

run({
  part1: {
    tests: [
      { input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`, expected: 4512 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`, expected: 1924 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
