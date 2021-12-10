import run from "aocrunner";

const openingChunks = <const> ['(', '[', '{', '<'];
const closingChunks = <const> [')', ']', '}', '>'];

type OpeningChunk = typeof openingChunks[number];
type ClosingChunk = typeof closingChunks[number];
type Chunk = OpeningChunk | ClosingChunk;

type Corrupted = {
  type: "corrupted",
  chunk: Chunk
}

type Incomplete = {
  type: "incomplete",
  chunks: Chunk[]
}

type Error = Corrupted | Incomplete;

const parseInput = (rawInput: string): Chunk[][] => rawInput.split("\n").map(line => line.split("").map(c => c as Chunk));

const corruptedChunkValue = (chunk: Chunk): number => [3, 57, 1197, 25137][closingChunks.indexOf(chunk as ClosingChunk)];
const middleChunkValue = (chunk: Chunk): number => closingChunks.indexOf(chunk as ClosingChunk) + 1;

const parseChunks = (chunks: Chunk[]): Error => {
  let stack: ClosingChunk[] = [];
  for (let chunk of chunks) {
    const openingChunkPos = openingChunks.indexOf(chunk as OpeningChunk)
    if (openingChunkPos >= 0) {
      stack.push(closingChunks[openingChunkPos]);
    }

    if (closingChunks.indexOf(chunk as ClosingChunk) >= 0) {
      if (stack[stack.length-1] == chunk) {
        stack.pop();
        continue;
      }

      return {type: "corrupted", chunk};
    }
  }

  return { type: "incomplete", chunks: stack.reverse()};
};

const calculateMiddleScore = (chunks: Chunk[]): number =>
  chunks.reduce((prevValue, chunk) => (prevValue * 5) + middleChunkValue(chunk), 0);

const part1 = (rawInput: string) =>
  parseInput(rawInput)
    .map(chunks => parseChunks(chunks))
    .filter<Corrupted>((error): error is Corrupted => error.type === "corrupted")
    .reduce((prevValue, error) => prevValue + corruptedChunkValue(error.chunk), 0);

const part2 = (rawInput: string) => {
  const incomplete = parseInput(rawInput)
    .map(chunks => parseChunks(chunks))
    .filter<Incomplete>((error): error is Incomplete => error.type === "incomplete")
    .map(error => calculateMiddleScore(error.chunks));

  incomplete.sort((a, b) => a - b);
  return incomplete[(incomplete.length-1)/2];
};

run({
  part1: {
    tests: [
      { input: `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`, expected: 26397 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`, expected: 288957 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
