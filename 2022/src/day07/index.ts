import run from "aocrunner";
import "../utils/index.js"

type File = {
  name: string,
  size: number
}

type Dir = {
  name: string,
  parent: Dir | null,
  nodes: Node[]
  size: number
}

type Node = Dir | File;

const newDir = (name: string): Dir => { return { name, parent: null, nodes: [], size: 0 } };
const newFile = (name: string, size: number): File => { return { name, size } };

const calculateNodeSize = (node: Dir): number =>
  node.nodes.reduce((prev, file) => prev + file.size, 0)

const parseLsLine = (line: string): Node => {
  const [ left, right ] = line.split(" ");

  if (left == "dir") {
    return newDir(right);
  }
  
  return newFile(right, parseInt(left));
}

const parseInput = (rawInput: string): Dir[] => {
  const nodes: Dir[] = [];
  const root = newDir('/');
  nodes.push(root);
  let currNode = root;

  rawInput.split("\n").slice(1).forEach(line => {
    if (line == "$ ls") {
      return;
    }

    if (line == "$ cd ..") {
      if (currNode.parent == null) {
        throw Error("Can't go higher than root");
      }

      // precalculate dir size by exploiting the fact we never go into a folder twice
      currNode.size = calculateNodeSize(currNode);

      currNode = currNode.parent;
      return;
    }

    if (line.startsWith("$ cd")) {
      const cdNodeName = line.slice(5);
      const cdNode = currNode.nodes.find(node => node.name == cdNodeName);
      if (typeof cdNode == "undefined" || !("parent" in cdNode)) {
        throw Error(`Could not find folder ${cdNodeName}`);
      }

      currNode = cdNode;
      return;
    }

    const newElem = parseLsLine(line);
    currNode.nodes.push(newElem);
    if ("parent" in newElem) {
      newElem.parent = currNode;
      nodes.push(newElem);
    }
  });

  // Head back to the root finalising all the node sizes
  while (currNode.parent) {
    currNode.size = calculateNodeSize(currNode);
    currNode = currNode.parent;  
  }
  
  root.size = calculateNodeSize(root);

  return nodes;
};

const part1 = (rawInput: string) => 
  parseInput(rawInput)
    .filter(node => node.size <= 100_000)
    .reduce((prev, curr) => prev + curr.size, 0);

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const minSize = 30_000_000 - (70_000_000 - input[0].size);  
  
  return input
    .filter(node => node.size >= minSize)
    .reduce((prev, curr) => prev > curr.size ? curr.size : prev, Infinity);
};

run({
  part1: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
