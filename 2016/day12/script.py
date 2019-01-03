#!/usr/bin/env python3

import json

data = json.loads(open('input.json', 'r').read())

def get_numeric_value(data, skip_value=False):
    value = 0
    if type(data) == dict:
        if skip_value is not False and (skip_value in data or skip_value in data.values()):
            value = 0
        else:
            value = sum([(k if type(k) is int else 0) + get_numeric_value(v, skip_value) for (k,v) in data.items()])
    elif type(data) == list:
        value = sum([get_numeric_value(x, skip_value) for x in data])
    elif type(data) == int:
        value = data

    return value

print("The total sum of all numbers is: %d" % get_numeric_value(data))
print("The total sum of all non-red numbers is %d" % get_numeric_value(data, 'red'))