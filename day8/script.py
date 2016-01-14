#!/usr/bin/env python3

import sys

total_code = 0
total_char = 0

def count_totals(string):
    total_char = 0
    total_code = 2
    i = 1
    while i < len(string)-1:
        if string[i] != '\\':
            total_code += 1
            total_char += 1
        elif string[i+1] in ['\\', '"']:
            i += 1
            total_char += 1
            total_code += 2
        elif string[i+1] == 'x':
            i += 3
            total_char += 1
            total_code += 4
        i += 1

    return (total_code, total_char)

for l in open('input.txt', 'r'):
    (tcode, tchar) = count_totals(l.rstrip())

    total_code += tcode
    total_char += tchar

print("The total code is %d" % total_code)
print("The total characters is %d" % total_char)
print("Difference is %d" % (total_code - total_char))