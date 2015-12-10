#!/usr/bin/env python3

import re, sys

cables = {}
instructions = []
commands = {
    'LSHIFT': lambda x, y: x << y,
    'RSHIFT': lambda x, y: x >> y,
    'AND': lambda x, y: x & y,
    'OR': lambda x, y: x | y,
    'NOT': lambda x: ~x,
    'XOR': lambda x, y: x ^ y,
}

def parse_instruction(result):
    instruction = {
        'output': result[-1:][0]
    }

    if len(result) == 5:
        instruction['inputs'] = [result[0], result[2]]
        instruction['command'] = result[1]
    elif len(result) == 4:
        instruction['inputs'] = [result[1]]
        instruction['command']  = result[0]
    elif len(result) == 3:
        instruction['inputs'] = [result[0]]
        instruction['command'] = None

    return instruction

def test_digit(i):
    return type(i) == type(int()) or i.isdigit()

def all_digits(inputs):
    is_digit = True
    for i in inputs:
        is_digit = is_digit and test_digit(i)
    return is_digit

def run_instruction(instruction):
    if instruction['command'] is None and test_digit(instruction['inputs'][0]):
        cables[instruction['output']] = instruction['inputs'][0]
    elif instruction['command'] is not None:
        c = commands[instruction['command']]
        if len(instruction['inputs']) == 1:
            cables[instruction['output']] = c(int(instruction['inputs'][0]))
        elif len(instruction['inputs']) == 2:
            cables[instruction['output']] = c(int(instruction['inputs'][0]), int(instruction['inputs'][1]))

def run_instructions(instructions):
    while len(instructions) > 0:
        i = 0
        for instruction in instructions:
            j = 0
            for inp in instruction['inputs']:
                if inp in cables:
                    instruction['inputs'][j] = cables[inp]
                j += 1

            if all_digits(instruction['inputs']):
                run_instruction(instruction)
                del instructions[i]

            i += 1

instructions = [parse_instruction(line.split()) for line in open('input.txt', 'r')]
run_instructions(instructions)

print("The value of the cable 'a' is: %d" % cables['a'])

instructions = [parse_instruction(line.split()) for line in open('input.txt', 'r')]

i = 0
for instruction in instructions:
    if instruction['output'] == 'b':
        instructions[i]['inputs'] = [cables['a']]
    i += 1

cables = {}
run_instructions(instructions)

print("The value of the cable 'a' is: %d" % cables['a'])