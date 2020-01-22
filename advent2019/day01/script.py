#!/bin/env python3

import os
from math import floor

def calculate_module_fuel(mass: int) -> int:
    return floor(mass / 3) - 2

assert (calculate_module_fuel(12) == 2)
assert (calculate_module_fuel(14) == 2)
assert (calculate_module_fuel(1969) == 654)
assert (calculate_module_fuel(100756) == 33583)

"""
You need fuel to carry your fuel
"""
def calculate_total_module_fuel(mass: int) -> int:
    total_fuel = 0
    while True:
        fuel = calculate_module_fuel(mass)

        if fuel <= 0:
            break

        total_fuel += fuel
        mass = fuel

    return total_fuel

assert (calculate_total_module_fuel(14) == 2)
assert (calculate_total_module_fuel(1969) == 966)
assert (calculate_total_module_fuel(100756) == 50346)

def run():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    print(
        "Total fuel for all modules is:",
        sum([calculate_module_fuel(int(line.rstrip())) for line in open(dir_path+'/input.txt')])
    )
    print(
        "Total fuel for all modules including fuel is:",
        sum([calculate_total_module_fuel(int(line.rstrip())) for line in open(dir_path+'/input.txt')])
    )