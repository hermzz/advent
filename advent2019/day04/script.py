#!/bin/env python3

start = 109165
end = 576723

def isIncreasing(input: str) -> bool:
    for i in range(0, 5):
        if input[i] > input[i+1]:
            return False

    return True

def hasDouble(input: str) -> bool:
    for i in range(0, 5):
        if input[i] == input[i+1]:
            return True

    return False

def hasImprovedDouble(input: str) -> bool:
    groups = []

    group = [input[0:1]]
    for i in range(1, 6):
        if input[i] != group[-1]:
            groups.append(group)
            group = [input[i]]
        else:
            group.append(input[i])

    groups.append(group)

    for group in groups:
        if len(group) == 2:
            return True

    return False

def isValid(input: str) -> bool:
    return isIncreasing(input) and hasDouble(input)

def isImprovedValid(input: str) -> bool:
    return isIncreasing(input) and hasImprovedDouble(input)

assert(hasDouble(str(111111)) == True)
assert(hasDouble(str(123456)) == False)
assert(hasDouble(str(123455)) == True)

assert(isIncreasing(str(111111)) == True)
assert(isIncreasing(str(223450)) == False)
assert(isIncreasing(str(123455)) == True)

assert(isValid(str(111111)) == True)
assert(isValid(str(223450)) == False)
assert(isValid(str(123789)) == False)

assert(hasImprovedDouble(str(112233)) == True)
assert(hasImprovedDouble(str(123444)) == False)
assert(hasImprovedDouble(str(111122)) == True)

print("Number of total possible passwords are:", sum([1 for i in range(start, end) if isValid(str(i))]))
print("Number of total possible improved passwords are:", sum([1 for i in range(start, end) if isImprovedValid(str(i))]))