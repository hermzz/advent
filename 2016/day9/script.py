#!/usr/bin/env python3
import re,math

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

    graph.append({'start': depart, 'end': arrive, 'distance': int(distance)})
    graph.append({'start': arrive, 'end': depart, 'distance': int(distance)})

def recursiveSalesman(visited_nodes, arrive, nodes, graph, limit, method, distance):
    last_node = visited_nodes[-1:][0]

    shortest_distance = limit
    shortest_path = False
    for node in graph:
        if node['start'] == last_node and node['end'] not in visited_nodes:
            (new_path, new_distance) = recursiveSalesman(visited_nodes + [node['end']], arrive, nodes, graph, limit, method, distance + node['distance'])

            if method(new_distance, shortest_distance):
                shortest_distance = new_distance
                shortest_path = new_path

    if shortest_path is False:
        if last_node == arrive and len(nodes) == len(visited_nodes):
            return (visited_nodes, distance)
        else:
            return ([], limit)
    else:
        return (shortest_path, shortest_distance)

def shortest(a, b):
    return a < b

def longest(a, b):
    return a > b

def calculatePath(method, limit, nodes, graph):
    shortest = ([], limit)
    for depart in nodes:
        for arrive in nodes[(len(nodes) - nodes.index(depart)) * -1:]:
            if depart != arrive:
                new = recursiveSalesman([depart], arrive, nodes, graph, limit, method, 0)
                if method(new[1],  shortest[1]):
                    shortest = new

    print("The %s path is %s with distance %s" % (method.__name__, ' -> '.join(shortest[0]), shortest[1]))

calculatePath(shortest, math.inf, nodes, graph)
calculatePath(longest, -1, nodes, graph)