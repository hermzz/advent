data = open("input.txt").read().strip()
map = [[int(c) for c in r] for r in data.split("\n")]
p1, p2 = set(), set()
for r in range(1, len(map) - 1):
    for c in range(1, len(map[0]) - 1):
        seen = 1
        for r_move, c_move in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            r1, c1 = r, c
            neighbors = []
            while c1 + c_move >= 0 and c1 + c_move < len(map[0]) and r1 + r_move >= 0 and r1 + r_move < len(map):
                r1 += r_move
                c1 += c_move
                neighbors.append(map[r1][c1])
            if map[r][c] > max(neighbors):
                p1.add((r, c))
                seen *= len(neighbors)
            else:
                seen *= [i+1 for i, n in enumerate(neighbors) if n >= map[r][c]][0]
            p2.add(seen)
print(f"Part 1: {len(p1) + (4 * (len(map) - 1))}")
print(f"Part 2: {max(p2)}")