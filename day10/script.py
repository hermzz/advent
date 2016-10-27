#!/usr/bin/env python3
input = "3113322113"

def look_and_say(text):
    output = ""
    i = 0
    while i < len(text):
        current_char = text[i]
        times_repeated = 1
        lookahead = i + 1

        while lookahead < len(text) and text[lookahead] == current_char:
            times_repeated += 1
            lookahead += 1

        output += str(times_repeated) + str(current_char)
        i += times_repeated

    return output

for i in range(0, 40):
    output = look_and_say(input)
    print ("Iteration: %d => %s" % (i, len(output)))
    input = output