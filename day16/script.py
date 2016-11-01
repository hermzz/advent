#!/usr/bin/env python3

sues = {}
for line in open('input.txt', 'r'):
    name = line[0:line.index(':')]
    sues[name] = {}
    sues[name].update([(k.strip(), int(v)) for (k,v) in [item.split(':') for item in line[line.index(':')+2:].rstrip().split(',')]])

def retroencabulate_match(item, value, query):
    if item in ['cats', 'trees'] and query[item] < value:
        return True
    elif item in ['pomeranians', 'goldfish'] and query[item] > value:
        return True
    elif item not in ['cats', 'trees', 'pomeranians', 'goldfish'] and query[item] == value:
        return True
    
    return False

def find_matching_sue(query, sues):
    for (name, memories) in sues.items():
        if all([retroencabulate_match(item, value, query) for (item, value) in memories.items()]):
            return name
    
    return False
            
sue = find_matching_sue({
    'children': 3,
    'cats': 7,
    'samoyeds': 2,
    'pomeranians': 3,
    'akitas': 0,
    'vizslas': 0,
    'goldfish': 5,
    'trees': 3,
    'cars': 2,
    'perfumes': 1
}, sues)

print("%s bought the gift" % sue if sue else "It's a mystery!")