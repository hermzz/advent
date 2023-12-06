import run from "aocrunner";

type Seed = number;
type Seeds = Seed[];

type SeedRange = {
  start: number;
  end: number;
}
type SeedRanges = (SeedRange|null)[];

type Range = {
  source: number,
  destination: number,
  length: number;
}

type Maps = Record<string, Map>;
type Map = {
  to: string;
  ranges: Range[]
}

const reMapName = /(?<from>[a-z]+)-to-(?<to>[a-z]+) map:/

const loadMaps = (lines: string[]): Maps => {
  const maps: Maps = {};
  let currFrom: string|undefined;
  let currMap: Map|undefined;

  lines.forEach(line => {
    if (line == "") {
      return;
    }

    const matches = line.match(reMapName);
    if (matches) {
      if (currMap) {
        maps[currFrom!] = currMap;
      }

      currFrom = matches.groups!.from;
      currMap = {
        to: matches.groups!.to,
        ranges: []
      };

      return ;
    }

    const [ destination, source, length ] = line.split(" ").map(n => parseInt(n));
    currMap!.ranges.push({
      source,
      destination,
      length
    });
  });

  if (currMap) {
    maps[currFrom!] = currMap;
  }

  return maps;
}

const parseInputSeeds = (rawInput: string): [Seeds, Maps] => {
  const lines = rawInput.split("\n");

  const seeds: Seeds = lines.shift()!.slice("seeds: ".length).split(" ").map(n => parseInt(n));

  return [ seeds, loadMaps(lines) ];
};

const parseInputSeedRanges = (rawInput: string): [SeedRanges, Maps] => {
  const lines = rawInput.split("\n");

  const seedRanges: SeedRanges = [];
  const elements = lines.shift()!.slice("seeds: ".length).split(" ").map(n => parseInt(n));
  for (let i = 0; i < elements.length; i += 2) {
    seedRanges.push({
      start: elements[i],
      end: elements[i] + elements[i+1]
    });
  }

  return [ seedRanges, loadMaps(lines) ];
};

const moveSeed = (seed: Seed, map: Map): Seed => {
  let result = seed;
  for (let range of map.ranges) {
    if (range.source <= seed && seed < range.source + range.length) {
      return range.destination + (seed - range.source);
    }
  }
  return result;
}

const memoize: Record<string, number> = {};
const getSeedLocation = (category: string, seed: Seed, maps: Maps): number => {
  const memoKey = `${category}-${seed}`;
  if (memoize[memoKey]) {
    console.log(`Cache hit for ${memoKey}`);
    return memoize[memoKey];
  }

  const map = maps[category];

  if (category == 'location') {
    return seed;
  }

  const res = getSeedLocation(map.to, moveSeed(seed, map), maps);

  memoize[memoKey] = res;

  return res;
}

const part1 = (rawInput: string) => {
  const [ seeds, maps ] = parseInputSeeds(rawInput);

  return seeds.reduce((lowest, seed) => {
    const res = getSeedLocation('seed', seed, maps);
    return res < lowest ? res : lowest;
  }, Infinity);
};

const displace = (seedRange: SeedRange, mapRange: Range): SeedRange => {
  const move = mapRange.destination - mapRange.source

  return {
    start: seedRange.start + move,
    end: seedRange.end + move
  };
}

const flattenSeedRanges = (category: string, seedRanges: SeedRanges, maps: Maps): SeedRanges => {
  if (category == 'location') {
    return seedRanges;
  }

  const map = maps[category]!;

  const newSeedRanges: SeedRanges = [];
  for (let mapRange of map.ranges) {
    seedRanges = seedRanges.filter(x => x);
    for (let seedRangeIndex in seedRanges) {
      const seedRange = seedRanges[seedRangeIndex]!;
      if (mapRange.source <= seedRange.start && mapRange.source + mapRange.length >= seedRange.start) {
        if (mapRange.source + mapRange.length >= seedRange.end) {
          newSeedRanges.push(displace({
            start: seedRange.start,
            end: seedRange.end
          }, mapRange));
          seedRanges[seedRangeIndex] = null;
        } else {
          newSeedRanges.push(displace({
            start: seedRange.start,
            end: mapRange.source + mapRange.length
          }, mapRange));

          seedRanges[seedRangeIndex]!.start = mapRange.source + mapRange.length + 1;
        }
      } else if (mapRange.source >= seedRange.start && mapRange.source <= seedRange.end) {
        if (mapRange.source + mapRange.length < seedRange.end) {
          newSeedRanges.push(displace({
            start: mapRange.source,
            end: mapRange.source + mapRange.length
          }, mapRange));

          seedRanges.push({
            start: mapRange.source + mapRange.length,
            end: seedRange.end
          })
        } else {
          newSeedRanges.push(displace({
            start: mapRange.source,
            end: seedRange.end
          }, mapRange));
        }

        seedRange.end = mapRange.source - 1;
      }
    }
  }

  seedRanges = seedRanges.concat(newSeedRanges).filter(x => x);

  return flattenSeedRanges(map.to, seedRanges, maps);
}

const part2 = (rawInput: string) => {
  const [ seedRanges, maps ] = parseInputSeedRanges(rawInput);

  return flattenSeedRanges('seed', seedRanges, maps)
    .reduce((pv, seedRange) => seedRange!.start < pv ? seedRange!.start : pv, Infinity)
  ;
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
