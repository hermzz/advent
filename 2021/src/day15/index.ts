import run from "aocrunner";

interface Coord {
  x: number,
  y: number
};

type Edge = {
  terminal: Vertex,
  weight: number
};

interface Vertex extends Coord {
  name: string,
  edges: Edge[]
};

type Graph = Vertex[];
type Grid = number[][];

const findVertex = (graph: Graph, x: number, y: number): Vertex | undefined =>
  graph.find(v => v.x === x && v.y === y);

const getNeighbours = (grid: number[][], x: number, y: number): Coord[] => {
  const neighbours: Coord[] = [];
  if (y > 0) {
    neighbours.push({x, y: y - 1});
  }
  if (y < grid.length-1) {
    neighbours.push({x, y: y + 1});
  }
  if (x > 0) {
    neighbours.push({x: x - 1, y});
  }
  if (x < grid[0].length-1) {
    neighbours.push({x: x + 1, y});
  }
  return neighbours;
}

const createVertex = (graph: Graph, x: number, y: number): Vertex => {
  const vertex = {name: `${x}-${y}`, x, y, edges: []};
  graph.push(vertex);
  return vertex;
}

const parseInput = (rawInput: string): Grid => {
  const grid = rawInput.split("\n").map(line => line.split("").map(n => parseInt(n, 10)));

  return grid;
}

const embiggenGrid = (grid: Grid): Grid => {
  const newGrid: Grid = []

  const height = grid.length;
  const times = 5;
  const multiple = Array.from({length: times}, (v, k) => k);
  multiple.forEach(i => {
    Array.from({length: grid.length}).forEach(_x => newGrid.push([]));
    multiple.forEach(j =>
      grid.forEach((line, y) =>
      {
        return line.forEach((p) => {
          let newP = (p+i+j);
          if (newP > 9) {
            newP = newP-9;
          }
          newGrid[y+(i*height)].push(newP);
        });
      })
    )}
  );

  return newGrid;
};

const createGraph = (grid: Grid): Graph => {
  const graph: Graph = [];
  grid.forEach((line, y) => line.forEach((weight, x) => {
    let vertex = findVertex(graph, x, y);
    if (typeof vertex === "undefined") {
      vertex = createVertex(graph, x, y);
    }

    getNeighbours(grid, x, y).forEach(neighbour => {
      let terminal = findVertex(graph, neighbour.x, neighbour.y);
      if (!terminal) {
        terminal = createVertex(graph, neighbour.x, neighbour.y);
      }
      vertex!.edges.push({terminal, weight});
    });
  }));
  return graph;
}

const vn = (v: Vertex): string => v.name;

type Dist = Map<string, number>;
type Prev = Map<string, Vertex|undefined>;
const dijsktra = (graph: Graph, source: Vertex, target: Vertex): {dist: Dist, prev: Prev} => {
  let Q: Vertex[] = [];

  const dist = new Map<string, number>();
  const prev = new Map<string, Vertex|undefined>();
  let u: Vertex;
  let alt: number;

  graph.forEach(v => {
    const key = vn(v);
    dist.set(key, Infinity);
    prev.set(key, undefined);
    Q.push(v);
  });

  dist.set(vn(source), 0);

  while (Q.length > 0) {
    u = Q.reduce((min, next) => {
      if (dist.get(vn(next))! < dist.get(vn(min))!) {
        min = next;
      }
      return min;
    });
    Q = Q.filter(v => v.name != u.name);

    if (u.name == target.name) {
      return {dist, prev};
    }

    u.edges
      .map(e => e.terminal)
      .filter(t => Q.indexOf(t) > -1)
      .forEach(v => {
        alt = dist.get(vn(u))! + u.edges.find(e => v.name === e.terminal.name)!.weight;

        if (alt < dist.get(vn(v))!) {
          dist.set(vn(v), alt);
          prev.set(vn(v), u);
        }
      });
  }

  return {
    dist, prev
  }
} 

const getPath = (prev: Prev, target: Vertex): string[] => {
  const path: string[] = [];

  let u: Vertex|undefined = target;
  while (u) {
    path.splice(0, 0, vn(u));
    u = prev.get(vn(u))!;
  }

  return path;
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  /*if (grid.length > 10) {
    return 0;
  }*/
  const graph = createGraph(grid);

  const source = findVertex(graph, 0, 0)!;
  const target = findVertex(graph, grid[0].length - 1, grid.length - 1)!;

  //graph.forEach(v => console.log(`x: ${v.x} y: ${v.y} -> ${v.edges.map(e => e.terminal.x+'-'+e.terminal.y+'='+e.weight).join(", ")}`))

  const res = dijsktra(graph, source, target);
  const shortestPath = getPath(res.prev, target);
  //console.log(shortestPath);
  return shortestPath.reduce((acc,z) => {
    if (z == '0-0') {
      return acc;
    }
    const [x,y] = z.split('-');
    return acc + grid[parseInt(y, 10)][parseInt(x, 10)];
  }, 0);
  //console.log(grid.map((line, y) => line.map((n, x) => shortestPath.indexOf(`${x}-${y}`) > -1 ? `\x1b[32m${n}\x1b[0m` : n).join("")).join("\n"))

  //return res['dist'][vn(target)];
};

const part2 = (rawInput: string) => {
  let grid = parseInput(rawInput);
  grid = embiggenGrid(grid);
  const graph = createGraph(grid);

  const source = findVertex(graph, 0, 0)!;
  const target = findVertex(graph, grid[0].length - 1, grid.length - 1)!;

  //graph.forEach(v => console.log(`x: ${v.x} y: ${v.y} -> ${v.edges.map(e => e.terminal.x+'-'+e.terminal.y+'='+e.weight).join(", ")}`))
  const res = dijsktra(graph, source, target);

  const shortestPath = getPath(res['prev'], target);
  //console.log(shortestPath);
  return shortestPath.reduce((acc,z) => {
    if (z == '0-0') {
      return acc;
    }
    const [x,y] = z.split('-');
    return acc + grid[parseInt(y, 10)][parseInt(x, 10)];
  }, 0);
};

run({
  part1: {
    tests: [
      { input: `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`, expected: 40 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`, expected: 315 }, //2853
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
