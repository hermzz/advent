#!/usr/bin/env python3

floor    = 0
step     = 1
basement = False
steps    = open('input.txt', 'r').read()

for s in steps:
    if s == '(':
        floor += 1
    else:
        floor -= 1

    if not basement and floor == -1:
        basement = step

    step += 1

print("Santa should go to floor: %d" % floor)
print("Santa will enter the basement on step: %d" % basement)