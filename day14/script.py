#!/usr/bin/env python3

import re, math

descriptions = re.compile(r"([A-Za-z]+) can fly ([0-9]+) km/s for ([0-9]+) seconds, but then must rest for ([0-9]+) seconds.")

reindeers = {}
for line in open('input.txt', 'r'):
    description = descriptions.match(line)
    (reindeer, speed, duration, pause) = description.groups()

    if reindeer not in reindeers:
        reindeers[reindeer] = {}

    reindeers[reindeer] = {
        'speed': int(speed),
        'duration': int(duration),
        'pause': int(pause)
    }

def reindeer_distance(reindeer, seconds):
    time_unit = reindeer['duration'] + reindeer['pause']
    (iterations, seconds_elapsed) = divmod(seconds, time_unit)

    distance_elapsed = 0
    if seconds_elapsed > reindeer['duration']:
        iterations += 1
    else:
        distance_elapsed = seconds_elapsed * reindeer['speed']

    return (iterations * reindeer['speed'] * reindeer['duration']) + distance_elapsed

def race_distance(reindeers, seconds):
    farthest = math.inf * -1
    for (name, reindeer) in reindeers.items():
        distance = reindeer_distance(reindeer, seconds)
        if distance > farthest:
            farthest = distance

    print("In a race for %d seconds, the farthest reindeer is %d meters away" % (seconds, farthest))

def race_points(reindeers, seconds):
    points = {}
    for reindeer in reindeers:
        points[reindeer] = 0
    
    elapsed = 0
    while elapsed < seconds:
        elapsed += 1
        farthest_distance = 0
        farthest_reindeer = []
        
        for (name, reindeer) in reindeers.items():
            distance = reindeer_distance(reindeer, elapsed)
            if distance > farthest_distance:
                farthest_distance = distance
                farthest_reindeer = [name]
            elif distance == farthest_distance:
                farthest_reindeer += [name]
        
        for leading in farthest_reindeer:
            points[leading] += 1
    
    most_points = math.inf * -1
    for (name, point) in points.items():
        if point > most_points:
            most_points = point

    print("In a race for %d seconds, the best reindeer has %d points" % (seconds, most_points))

seconds = 2503
race_distance(reindeers, seconds)
race_points(reindeers, seconds)