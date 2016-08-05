#!/usr/bin/env python3

import sys,re

nodes = []
graph = []
route = re.compile(r"([A-Za-z]+) to ([A-Za-z]+) = ([0-9]+)")

for line in open('input.txt', 'r'):
    result = route.match(line)
    (depart, arrive, distance) = result.groups()

    if depart not in nodes:
        nodes.append(depart)

    if arrive not in nodes:
        nodes.append(arrive)

    graph.append({'ends': [depart, arrive], 'distance': int(distance)})

def getDepartArrive(depart, ends):
    if ends[0] == depart:
        return (ends[0], ends[1])
    elif ends[1] == depart:
        return (ends[1], ends[0])
    else:
        return (False, False)

def findShortestStep(depart, steps, graph):
    #print("Depart: %s" % depart)
    #print(steps)
    arrive = False
    shortest = 0
    for node in graph:
        (d, a) = getDepartArrive(depart, node['ends'])
        #print("d,a: %s => %s" % (d,a))
        if depart == d and a not in steps and (shortest == 0 or node['distance'] < shortest):
            shortest = node['distance']
            arrive = a

    return (arrive, shortest)

# Cycle through all the possible combinations of departure and arrival nodes
# and run Dijkstra's algorithm algorithm for each, keep the lowest

def dijkstra(depart, arrive, graph):
    # Keep an array of lists of nodes with their corresponding lengths
    # For each step, find the shortest length and add the shortest path
    # Until there are no more possible steps left, then return the
    # shortest list of nodes

    #print("%s => %s" % (depart, arrive))
    lists = []
    for node in graph:
        (d, a) = getDepartArrive(depart, node['ends'])
        if d:
            lists.append({'steps': [d, a], 'distance': node['distance']})

    done = False
    while not done:
        potential = {}
        i = 0
        for l in lists:
            if len(l['steps']) > 7:
                sys.exit()

            #print("List")
            #print(l)

            d = l['steps'][-1:][0]

            (a, shortest) = findShortestStep(d, l['steps'], graph)

            #print("Shortest")
            #print({'a': a, 'shortest': shortest})

            if shortest > 0 and (len(potential) == 0 or shortest + l['distance'] < potential['distance']):
                potential = {'index': i, 'arrive': a, 'distance': shortest}

            #print("")

            if d == arrive:
                print(l, potential)
                return l['distance'] + potential['distance']

        #print("Potential")
        #print(potential)

        if len(potential) > 0:
            lists[potential['index']]['steps'].append(potential['arrive'])
            lists[potential['index']]['distance'] += potential['distance']
            #print(lists[potential['index']])
        else: 
            done = True

shortest = 0
for depart in nodes:
    for arrive in nodes:
        if depart != arrive:
            distance = dijkstra(depart, arrive, graph)
            if (shortest == 0 or distance < shortest):
                shortest = distance

print("The shortest path is %d" % shortest)