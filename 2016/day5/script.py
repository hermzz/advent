#!/usr/bin/env python3

import re

double = re.compile(r"([a-z])\1")
vowels = re.compile(r"[aeiou]")
forbidden = ['ab', 'cd', 'pq', 'xy']

def hasVowels(string):
    return len(vowels.findall(string)) >= 3

def hasDouble(string):
    return double.search(string) is not None

def hasForbidden(string):
    for pair in forbidden:
        if string.find(pair) is not -1:
            return True

    return False

total = 0
for word in open('input.txt', 'r'):
    word = word.rstrip()
    if not hasForbidden(word) and hasVowels(word) and hasDouble(word):
        total += 1

print ("The number of nice strings is: %d" % total)

pair = re.compile(r"([a-z]{2,2}).*\1")
repeat = re.compile(r"([a-z])[a-z]\1")

def hasPair(string):
    return pair.search(string) is not None

def hasRepeat(string):
    return repeat.search(string) is not None

total = 0
for word in open('input.txt', 'r'):
    word = word.rstrip()
    if hasRepeat(word) and hasPair(word):
        total += 1

print ("The number of nice strings is: %d" % total)