#!/usr/bin/env python3

import hashlib

key = "iwrupvqb"

def hash(number):
    m = hashlib.md5()
    m.update((key + number).encode('utf-8'))
    return m.hexdigest()

def is_valid_hash(hash, zeros):
    return hash.startswith('0' * zeros)

def find_lowest_number(zeros):
    number = 1
    while True:
        if is_valid_hash(hash(str(number)), zeros):
            return number

        number += 1

print ("Lowest number to create a hash with 5 zeros is: %d" % find_lowest_number(5))
print ("Lowest number to create a hash with 6 zeros is: %d" % find_lowest_number(6))