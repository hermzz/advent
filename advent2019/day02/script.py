#!/bin/env python3

import os
from copy import deepcopy
from computer import run_program
from typing import List

def calculate_result(stack: List[int], noun: int, verb: int) -> str:
    stack[1] = noun
    stack[2] = verb

    run_program(stack)

    return stack[0]

def run():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    original_stack = open(dir_path+'/input.txt').read().split(',')
    stack = deepcopy(original_stack)
    print("Initial result is %s" % calculate_result(stack, '12', '2'))

    expected = '19690720'
    for noun in range(0, 100):
        for verb in range(0, 100):
            stack = deepcopy(original_stack)
            result = calculate_result(stack, noun, verb)

            if result == expected:
                print("Noun: %s Verb: %s Answer: %d" % (noun, verb, 100 * int(noun) + int(verb)))