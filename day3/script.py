#!/usr/bin/env python3

x       = 0
y       = 0
visited = {}
steps   = open('input.txt', 'r').read()

def visit(x, y):
    key = "%d,%d" % (x, y)
    if not key in visited:
        visited[key] = 0

    visited[key] += 1

def move(x, y):
    if step == '^':
        x += 1
    elif step == 'v':
        x -= 1
    elif step == '<':
        y -= 1
    elif step == '>':
        y += 1

    visit(x, y)

    return (x, y)

visit(x, y)
for step in steps:
    (x, y) = move(x, y)

print ("Number of houses visited more than once: %d" % ( sum([1 for (k, v) in visited.items() if v >= 1]) ))

visited = {}
robo_x  = 0
robo_y  = 0
santa_x = 0
santa_y = 0
i       = 0

visit(0, 0)
for step in steps:
    if i%2 == 0:
        (santa_x, santa_y) = move(santa_x, santa_y)
    else:
        (robo_x, robo_y) = move(robo_x, robo_y)

    i += 1

print ("Number of houses visited more than once by both: %d" % ( sum([1 for (k, v) in visited.items() if v >= 1]) ))