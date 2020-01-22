#!/bin/env python3

from typing import List, Optional

def get_parameters(modes: str, stack: List[str], *args) -> List[int]:
    if len(modes) < len(args):
        modes = modes.rjust(len(args), '0')

    modes = modes[::-1]

    params = []
    for (k, v) in enumerate(list(args)):
        if modes[k] == '0':
            params.append(int(stack[v])) 
        else:
            params.append(int(v))

    return params

def add(modes: str, stack: List[str], head: int, **kwargs) -> int:
    params = get_parameters(modes, stack, int(stack[head + 1]), int(stack[head + 2]))
    stack[int(stack[head + 3])] = str(params[0] + params[1])
    return head + 4

def multiply(modes: str, stack: List[str], head: int, **kwargs) -> int:
    params = get_parameters(modes, stack, int(stack[head + 1]), int(stack[head + 2]))
    stack[int(stack[head + 3])] = str(params[0] * params[1])
    return head + 4

def ask_input(modes: str, stack: List[str], head: int, **kwargs) -> int:
    inputs = kwargs.get('inputs', [])
    if len(inputs) > 0:
        value = inputs.pop()
    else:
        value = input('-> ')

    stack[int(stack[head + 1])] = value
    return head + 2

def print_output(modes: str, stack: List[str], head: int, **kwargs) -> int:
    params = get_parameters(modes, stack, int(stack[head + 1]))
    kwargs.get('outputs', []).append(str(params[0]))

    return head + 2

def jump_if_true(modes: str, stack: List[str], head: int, **kwargs) -> int:
    params = get_parameters(modes, stack, int(stack[head + 1]), int(stack[head + 2]))

    if params[0] != 0:
        return params[1]
    else:
        return head + 3

def jump_if_false(modes: str, stack: List[str], head: int, **kwargs) -> int:
    params = get_parameters(modes, stack, int(stack[head + 1]), int(stack[head + 2]))
    
    if params[0] == 0:
        return params[1]
    else:
        return head + 3

def less_than(modes: str, stack: List[str], head: int, **kwargs) -> int:
    params = get_parameters(modes, stack, int(stack[head + 1]), int(stack[head + 2]))
    stack[int(stack[head + 3])] = '1' if int(params[0]) < int(params[1]) else '0'

    return head + 4

def equals(modes: str, stack: List[str], head: int, **kwargs) -> int:
    params = get_parameters(modes, stack, int(stack[head + 1]), int(stack[head + 2]))
    stack[int(stack[head + 3])] = '1' if params[0] == params[1] else '0'

    return head + 4

def run_program(stack: List[str], inputs: Optional[List[str]]=[]) -> List[str]:
    opcodes = {
        '01': add,
        '02': multiply,
        '03': ask_input,
        '04': print_output,
        '05': jump_if_true,
        '06': jump_if_false,
        '07': less_than,
        '08': equals
    }

    outputs = []
    head = 0
    while True:
        modes = ''
        opcode = stack[head]

        if len(opcode) == 1:
            opcode = '0'+opcode
        elif len(opcode) >= 3:
            modes = opcode[:-2]
            opcode = opcode[-2:]

        if opcode not in opcodes.keys():
            return outputs

        fn = opcodes[opcode]
        head = fn(modes, stack, head, inputs=inputs, outputs=outputs)

def test(input: str, against: List[str], inputs: Optional[List[str]]=[]):
    outputs = run_program(input.split(','), inputs)

    assert (outputs == against)

if __name__ == '__main__':
    test('1,0,0,0,4,0,99', ['2'])
    test('2,3,0,3,4,3,99', ['6'])
    test('2,6,6,7,4,7,99,0', ['9801'])
    test('1,1,1,4,99,5,6,0,4,0,4,4,99', ['30', '2'])
    test('1002,6,3,6,4,6,33', ['99'])
    test('1101,100,-1,6,4,6,0', ['99'])

    # Jump if true
    test('3,3,1105,-1,9,1101,0,0,12,4,12,99,1', ['0'], inputs=['0'])
    test('3,3,1105,-1,9,1101,0,0,12,4,12,99,1', ['1'], inputs=['1'])

    # Jump if false
    test('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', ['0'], inputs=['0'])
    test('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', ['1'], inputs=['1'])

    # Equals
    test('3,9,8,9,10,9,4,9,99,-1,8', ['0'], inputs=['1'])
    test('3,9,8,9,10,9,4,9,99,-1,8', ['1'], inputs=['8'])

    test("""3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99""", ['999'], inputs=['7'])
    test("""3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99""", ['1000'], inputs=['8'])
    test("""3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99""", ['1001'], inputs=['9'])