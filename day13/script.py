#!/usr/bin/env python3

import re, math

preferences = re.compile(r"([A-Za-z]+) would (gain|lose) ([0-9]+) happiness units by sitting next to ([A-Za-z]+).")

def get_all_combinations(names):
    if len(names) == 1:
        return [names]

    combinations = []
    for i in range(0, len(names)):
        remaining = names[:i] + names[i+1:]

        sub_combinations = get_all_combinations(remaining)

        for j in sub_combinations:
            combinations += [[names[i]] + j]

    return combinations

def calculate_happiness(combination, people):
    happiness = 0

    for i in range(0, len(combination)):
        person = people[combination[i]]
        left = combination[(i-1) % len(people)]
        right = combination[(i+1) % len(people)]

        if left in person:
            happiness += person[left]

        if right in person:
            happiness += person[right]

    return happiness

def calculate_optimal_happiness(people):
    optimal = math.inf * -1
    combinations = get_all_combinations(list(people.keys()))
    for combination in combinations:
        happiness = calculate_happiness(combination, people)

        if happiness > optimal:
            optimal = happiness

    return optimal

people = {}
for line in open('input.txt', 'r'):
    result = preferences.match(line)
    (person, preference, number, friend) = result.groups()

    if person not in people:
        people[person] = {}

    people[person][friend] = (1 if preference == 'gain' else -1) * int(number)

print("Optimal seating arrangement produces %d happiness" % calculate_optimal_happiness(people))
people['Hermann'] = []
print("Optimal seating arrangement with me produces %d happiness" % calculate_optimal_happiness(people))