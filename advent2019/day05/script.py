#!/bin/env python3

import os
from copy import deepcopy
from computer import run_program

def run():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    original_stack = open(dir_path+'/input.txt').read().split(',')

    stack = deepcopy(original_stack)
    print(run_program(stack, inputs=['1']))

    stack = deepcopy(original_stack)
    print(run_program(stack, inputs=['5']))