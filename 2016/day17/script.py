#!/usr/bin/env python3

def test_combinations(combination, remain, litres):
    if len(remain) == 0:
        return [(combination, sum(combination) == litres)]
    else:
        if sum(combination) > litres:
            return [(combination, False)]
        else:
            return test_combinations(combination, remain[1:], litres) + test_combinations(combination + [remain[0]], remain[1:], litres)

containers = []
for container in open('input.txt', 'r'):
    containers += [int(container)]

litres = 150
combinations = [(combination, value) for (combination, value) in test_combinations([], containers, litres) if value]
print("There are %d combinations of containers to fit %d litres in" % (len([1 for (combination, value) in combinations if value]), litres))

fewest_containers = min([len(combination) for (combination, value) in combinations])
print("There are %d possible ways to achieve %d litres with %d containers" % (len([1 for (combination, value) in combinations if len(combination) == fewest_containers]), litres, fewest_containers))