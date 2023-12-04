import run from "aocrunner";

type Card = {
  copies: number;
  winningNumbers: number[];
  candidateNumbers: number[];
}

const parseInput = (rawInput: string): Card[] => rawInput.split("\n").map(line => {
  const [ winningNumbers, candidateNumbers ] = line
    .slice(line.indexOf(':')+2)
    .split(" | ")
    .map(segment => segment.split(" ").filter(n => n).map(n => parseInt(n)))
  ;

  return { winningNumbers, candidateNumbers, copies: 1};
});

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map(card =>
      card.winningNumbers.reduce((pv, n) =>
        card.candidateNumbers.indexOf(n) >= 0 ? (pv == 0 ? 1 : pv * 2) : pv,
      0)
    ).
    reduce((pv, score) => pv + score, 0)
;

const cardScore = (card: Card): number => card.winningNumbers.reduce((pv, n) =>
  card.candidateNumbers.indexOf(n) >= 0 ? pv + 1 : pv,
0);

const queue: number[] = [];
const part2 = (rawInput: string) => 
  parseInput(rawInput)
    .map((card, i, cards) => {
      cards.slice(i + 1, i + 1 + cardScore(card)).forEach(c => c.copies += card.copies);
      return card;
    })
    .reduce((pv, card) => pv + card.copies, 0);
;

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
