#!/bin/env python3

from typing import List, Dict, Tuple
from math import inf

def generate_wire_coords(steps: List[str]) -> List[Tuple[int, int]]:
    coords = [(0, 0)]

    for step in steps:
        direction = step[0:1]
        distance = int(step[1:])

        multiplier = -1 if direction in ['L', 'D'] else 1

        pivot = coords[-1:][0]
        for i in range(1, distance + 1):
            if direction in ['L', 'R']:
                new_coord = (pivot[0] + multiplier * i, pivot[1])
            else:
                new_coord = (pivot[0], pivot[1] + multiplier * i)

            coords.append(new_coord)

    # We don't want (0, 0)
    return coords[1:]

def find_crossings(wire1: List[Tuple[int, int]], wire2: List[Tuple[int, int]]) -> List[Tuple[int, int, int]]:
    crossings = []

    for index1, coord1 in enumerate(wire1):
        for index2, coord2 in enumerate(wire2):
            if coord1 == coord2:
                # +2 because we removed (0, 0)
                crossings.append((coord1[0], coord1[1], index1 + index2 + 2))

    return crossings

def manhattan_distance(coord: Tuple[int, int]) -> int:
    return abs(coord[0]) + abs(coord[1])

def find_closest_crossing(wire1: List[str], wire2: List[str]) -> int:
    crossings = find_crossings(generate_wire_coords(wire1), generate_wire_coords(wire2))

    return min([manhattan_distance(crossing) for crossing in crossings])

def find_fastest_crossing(wire1: List[str], wire2: List[str]) -> int:
    crossings = find_crossings(generate_wire_coords(wire1), generate_wire_coords(wire2))

    fastest_crossing = inf
    for crossing in crossings:
        if crossing[2] < fastest_crossing:
            fastest_crossing = crossing[2]

    return fastest_crossing

assert (find_closest_crossing(['R8', 'U5', 'L5', 'D3'], ['U7', 'R6', 'D4', 'L4']) == 6)
assert (find_closest_crossing(['R75', 'D30', 'R83', 'U83', 'L12', 'D49', 'R71', 'U7', 'L72'], ['U62', 'R66', 'U55', 'R34', 'D71', 'R55', 'D58', 'R83']) == 159)
assert (find_closest_crossing(['R98', 'U47', 'R26', 'D63', 'R33', 'U87', 'L62', 'D20', 'R33', 'U53', 'R51'], ['U98', 'R91', 'D20', 'R16', 'D67', 'R40', 'U7', 'R15', 'U6', 'R7']) == 135)

assert (find_fastest_crossing(['R8', 'U5', 'L5', 'D3'], ['U7', 'R6', 'D4', 'L4']) == 30)
assert (find_fastest_crossing(['R75', 'D30', 'R83', 'U83', 'L12', 'D49', 'R71', 'U7', 'L72'], ['U62', 'R66', 'U55', 'R34', 'D71', 'R55', 'D58', 'R83']) == 610)
assert (find_fastest_crossing(['R98', 'U47', 'R26', 'D63', 'R33', 'U87', 'L62', 'D20', 'R33', 'U53', 'R51'], ['U98', 'R91', 'D20', 'R16', 'D67', 'R40', 'U7', 'R15', 'U6', 'R7']) == 410)

wires = [line.strip().split(',') for line in open('./input.txt')]
print("Closest intersection is:", find_closest_crossing(wires[0], wires[1]))
print("Fastest intersection is:", find_fastest_crossing(wires[0], wires[1]))
