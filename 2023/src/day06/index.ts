import run from "aocrunner";

type Race = {
  time: number;
  distance: number;
};
type Races = Race[];

const parseInput = (rawInput: string): Races => {
  const [time, distance] = rawInput
    .split("\n")
    .map(line => line.slice("Time:      ".length).trim().split(/\s+/).map(n => parseInt(n)))
  ;

  return time.map((n, i) => { return { time: n, distance: distance[i] }; });
};

const parseInputSingleRace = (rawInput: string): Race => {
  const [time, distance] = rawInput
    .split("\n")
    .map(line => line.slice("Time:      ".length).trim().replace(/\s/g, ''))
  ;

  return { time: parseInt(time), distance: parseInt(distance) };
};

const countWins = (race: Race): number => {
  // ax2 + bx + c, a = 1, b = -time, c = distance
  let sqrt = Math.sqrt(race.time * race.time - 4 * race.distance);
  let r1 = (race.time - sqrt) / 2
  let r2 = (race.time + sqrt) / 2
  if (Number.isInteger(r1)) { r1++; }
  if (Number.isInteger(r2)) { r2--; }
  r1 = Math.ceil(r1)
  r2 = Math.floor(r2)
  return (r2 - r1) + 1;
}

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map(race => countWins(race))
    .reduce((pv, wins) => pv * wins, 1)
;

const part2 = (rawInput: string) => countWins(parseInputSingleRace(rawInput));

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
