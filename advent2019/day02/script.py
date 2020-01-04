#!/bin/env python3

from copy import deepcopy
from typing import List

def run_program(stack: List[int]) -> List[int]:
    head = 0
    while True:
        if stack[head] not in [1, 2]:
            break;

        opcode = stack[head]

        if opcode == 1:
            add(stack, head)
        elif opcode == 2:
            multiply(stack, head)

        head += 4

    return stack

def add(stack: List[int], head: int):
    stack[stack[head + 3]] = (stack[stack[head + 1]]) + (stack[stack[head + 2]])

def multiply(stack: List[int], head: int):
    stack[stack[head + 3]] = (stack[stack[head + 1]]) * (stack[stack[head + 2]])

assert (run_program([1,0,0,0,99])[0] == 2)
assert (run_program([2,3,0,3,99])[3] == 6)
assert (run_program([2,4,4,5,99,0])[5] == 9801)
new_stack = run_program([1,1,1,4,99,5,6,0,99])
assert (new_stack[0] == 30)
assert (new_stack[4] == 2)

def calculate_result(stack: List[int], noun: int, verb: int) -> int:
    stack[1] = noun
    stack[2] = verb

    new_stack = run_program(stack)

    return stack[0]

original_stack = [int(n) for n in open('./input.txt').read().split(',')]
stack = deepcopy(original_stack)
print("Initial result is %d" % calculate_result(stack, 12, 2))

expected = 19690720
for noun in range(0, 100):
    for verb in range(0, 100):
        stack = deepcopy(original_stack)
        result = calculate_result(stack, noun, verb)

        if result == expected:
            print("Noun: %d Verb: %d Answer: %d" % (noun, verb, 100 * noun + verb))