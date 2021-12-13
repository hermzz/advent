import run from "aocrunner";

type Node = {
  name: string,
  connections: Node[]
}
type Graph = Node[];
type Path = Node[];

const findNode = (graph: Graph, name: string): Node|null => {
  const nodes = graph.filter(v => v.name == name);

  if (nodes.length > 0) {
    return nodes.pop()!;
  }

  return null;
}

const parseInput = (rawInput: string): Graph => {
  const graph: Graph = [];

  rawInput.split("\n").forEach((edge) => {
    const [start, end] = edge.split("-");

    let startNode = findNode(graph, start);
    if (!startNode) {
      startNode = {name: start, connections: []};
      graph.push(startNode);
    }

    let endNode = findNode(graph, end);
    if (!endNode) {
      endNode = {name: end, connections: []};
      graph.push(endNode);
    }

    startNode.connections.push(endNode);
    endNode.connections.push(startNode)
  })

  return graph;
};

const canHitAgain = (name: string, path: Path): boolean => isUpperCase(name) || !nodeInPath(name, path);
const canHitAgainExtraSmallCave = (name: string, path: Path): boolean => isUpperCase(name) || (['start', 'end'].indexOf(name) === -1 && !(haveHitLowerCaseTwice(path))) || !nodeInPath(name, path);

const haveHitLowerCaseTwice = (path: Path): boolean =>
  path.map(n => n.name).filter(n => isLowercase(n)).reduce((pv: boolean, name, index, path) => pv || path.slice(index+1).indexOf(name) !== -1, false);

const nodeInPath = (name: string, path: Path): boolean =>
  path.reduce((found: boolean, pNode) => found || name === pNode.name, false);

const isUpperCase = (name: string): boolean => name.toUpperCase() === name;
const isLowercase = (name: string): boolean => name.toLowerCase() === name;

const traverseGraph = (graph: Graph, startNode: Node, path: Path, hitCheck: (name: string, path: Path) => boolean): Path[] => {
  let paths: Path[] = [];

  for (let next of startNode.connections) {
    const nextPath = path.concat([next]);
    if (hitCheck(next.name, path)) {
      if (next.name === 'end') {
        paths.push(path.concat(next));
      }

      paths = paths.concat(traverseGraph(graph, next, nextPath, hitCheck));
    }
  }

  return paths;
}

const part1 = (rawInput: string) => {
  const graph = parseInput(rawInput);
  const startNode = findNode(graph, 'start');

  return traverseGraph(graph, startNode!, [startNode!], canHitAgain).length;
};

const part2 = (rawInput: string) => {
  const graph = parseInput(rawInput);
  const startNode = findNode(graph, 'start');

  return traverseGraph(graph, startNode!, [startNode!], canHitAgainExtraSmallCave).length;
};

run({
  part1: {
    tests: [
      { input: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`, expected: 10 },
      { input: `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`, expected: 19 },
      { input: `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`, expected: 226 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`, expected: 36 },
      { input: `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`, expected: 103 },
      { input: `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`, expected: 3509 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
