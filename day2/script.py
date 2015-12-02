#!/usr/bin/env python3

def calc_area(m, n):
    return 2 * m * n

def calc_perimeter(m, n):
    return (m + n) * 2

def get_smallest(top, front, side):
    small = top
    if (front < small):
        small = front

    if (side < small):
        small = side

    return small

def get_area(l, w, h):
    top   = calc_area(w, l)
    front = calc_area(h, w)
    side  = calc_area(l, h)

    return top + front + side + int(get_smallest(top, front, side)/2)3737498

def get_volume(l, w, h):
    return l* w * h

def get_smallest_perimeter(l, w, h):
    top   = calc_perimeter(w, l)
    front = calc_perimeter(h, w)
    side  = calc_perimeter(l, h)

    return get_smallest(top, front, side)

def get_ribbon(l, w, h):
    return get_smallest_perimeter(l, w, h) + get_volume(l, w, h)

area   = 0
ribbon = 0 
for l in open('input.txt', 'r'):
    (l, w, h) = [int(d) for d in l.rstrip().split('x')]
    area   += get_area(l, w, h)
    ribbon += get_ribbon(l, w, h)

print("Amount of wrapping paper needed: %d" % area)
print("Amount of ribbon needed: %d" % ribbon)