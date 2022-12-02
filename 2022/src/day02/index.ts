import run from "aocrunner";

const choices = ["rock", "paper", "scissors"] as const;
type Choice = typeof choices[number];

type Game = {
  opponent: Choice;
  mine: Choice;
};
type Games = Game[];

const winMap: Record<Choice, Choice> = {
  "paper": "rock",
  "rock": "scissors",
  "scissors": "paper"
};

const choiceMap: Record<string, Choice> = {
  "A": "rock", "X": "rock",
  "B": "paper", "Y": "paper",
  "C": "scissors", "Z": "scissors"
};

const predictionMap: Record<string, (c: Choice) => Choice> = {
  "X": c => winMap[c],
  "Y": c => c,
  "Z": c => winMap[winMap[c]],
};

const parseInput = (rawInput: string): Games => rawInput.split("\n").map(line => {
  const [ left, right ] = line.split(" ");

  return {
    opponent: choiceMap[left],
    mine: choiceMap[right]
  };
});

const parseInputPrediction = (rawInput: string): Games => rawInput.split("\n").map(line => {
  const [ left, right ] = line.split(" ");

  return {
    opponent: choiceMap[left],
    mine: predictionMap[right](choiceMap[left])
  };
});

const calculateOutcome = (game: Game): number => {
  if (game.opponent == game.mine) {
    return choices.indexOf(game.mine) + 1 + 3;
  }

  return choices.indexOf(game.mine) + 1 + (winMap[game.mine] == game.opponent ? 6 : 0);
}

const part1 = (rawInput: string) =>
  parseInput(rawInput)
  .reduce((prev, curr) => prev + calculateOutcome(curr), 0);

const part2 = (rawInput: string) => 
  parseInputPrediction(rawInput)
  .reduce((prev, curr) => prev + calculateOutcome(curr), 0);

run({
  part1: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
