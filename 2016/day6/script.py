#!/usr/bin/env python3

import re

instructions = re.compile(r"(.*) ([0-9]+),([0-9]+) through ([0-9]+),([0-9]+)")
binary_lights = [[0 for x in range(0, 1000)] for y in range(0,1000)]
binary_commands = {
    'turn on': lambda light: 1,
    'turn off': lambda light: 0,
    'toggle': lambda light: 1 if light == 0 else 0
}

brightness_lights = [[0 for x in range(0, 1000)] for y in range(0,1000)]
brightness_commands = {
    'turn on': lambda light: light + 1,
    'turn off': lambda light: 0 if light == 0 else light - 1,
    'toggle': lambda light: light + 2
}

def process(lights, command, from_x, from_y, to_x, to_y):
    for x in range(from_x, to_x + 1):
        for y in range(from_y, to_y + 1):
            lights[x][y] = command(lights[x][y])

def sum_lights(lights):
    return sum([ sum([y for y in x]) for x in lights])

for line in open('input.txt', 'r'):
    result = instructions.match(line)
    (command, from_x, from_y, to_x, to_y) = result.groups()

    process(binary_lights, binary_commands[command], int(from_x), int(from_y), int(to_x), int(to_y))
    process(brightness_lights, brightness_commands[command], int(from_x), int(from_y), int(to_x), int(to_y))

print("Binary lights lit: %d" % sum_lights(binary_lights))
print("Brightness lights lit: %d" % sum_lights(brightness_lights))

