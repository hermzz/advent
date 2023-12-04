import run from "aocrunner";

const parseInput = (rawInput: string): Games => rawInput.split("\n").map(line =>
  line.slice(line.indexOf(':') + 2).split("; ").map(draw => {
    let [ red, green, blue ] = [ 0, 0, 0 ];
    draw.split(', ').forEach(chunk => {
      const elements = chunk.split(' ');
      const [value, name] = [ parseInt(elements[0]), elements[1] ];

      if (name == "red") {
        red = value;
      } else if (name == 'green') {
        green = value;
      } else if (name == 'blue') {
        blue = value;
      }
    });

    return { red, green, blue } as Draw
  })
);

type Games = Game[];
type Game = Draw[];
type Draw = {
  red: number,
  blue: number,
  green: number
}

const isPossible = (game: Game, totalRed: number, totalGreen: number, totalBlue: number): boolean =>
  game.filter(draw => 
    draw.red <= totalRed &&
    draw.green <= totalGreen &&
    draw.blue <= totalBlue
  ).length == game.length;

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .reduce((pv, game, index) => pv + (isPossible(game, 12, 13, 14) ? index + 1 : 0) ,0)
;

const calculateMinimumDraw = (game: Game): Draw => 
  game.reduce((pv, draw) => {
    return {
      red: draw.red > pv.red ? draw.red : pv.red,
      green: draw.green > pv.green ? draw.green : pv.green,
      blue: draw.blue > pv.blue ? draw.blue : pv.blue,
    }
  }, {red: 0, green: 0, blue: 0});

const part2 = (rawInput: string) => 
  parseInput(rawInput)
    .map(game => calculateMinimumDraw(game))
    .map(draw => draw.red * draw.green * draw.blue)
    .reduce((pv, pow) => pv + pow, 0);
;

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
