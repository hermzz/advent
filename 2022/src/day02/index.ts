import run from "aocrunner";

type Choice = "rock" | "paper" | "scissors";
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

const choicePrize = {
  "rock": 1,
  "paper": 2,
  "scissors": 3
};

const parseChoice = (input: string): Choice => {
  if (input == "A" || input == "X") {
    return "rock";
  } else if (input == "B" || input == "Y") {
    return "paper";
  } else if (input == "C" || input == "Z") {
    return "scissors";
  }

  throw Error(`Unreconized option: ${input}`);
}

const parseChoicePrediction = (choice: Choice, prediction: string): Choice => {
  if (prediction == "Y") {
    return choice;
  } else if (prediction == "Z") {
    return winMap[winMap[choice]];
  } else if (prediction === "X") {
    return winMap[choice];
  }

  throw Error(`Unreconized option: ${prediction}`);
}

const parseInput = (rawInput: string): Games => rawInput.split("\n").map(line => {
  const [ left, right ] = line.split(" ");

  return {
    opponent: parseChoice(left),
    mine: parseChoice(right)
  };
});

const parseInputPrediction = (rawInput: string): Games => rawInput.split("\n").map(line => {
  const [ left, right ] = line.split(" ");

  return {
    opponent: parseChoice(left),
    mine: parseChoicePrediction(parseChoice(left), right)
  };
});

const calculateOutcome = (game: Game): number => {
  if (game.opponent == game.mine) {
    return choicePrize[game.mine] + 3;
  }

  return choicePrize[game.mine] + (winMap[game.mine] == game.opponent ? 6 : 0);
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
