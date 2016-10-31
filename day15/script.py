#!/usr/bin/env python3

import re, math

descriptions = re.compile(r"([A-Za-z]+): capacity ([0-9\-]+), durability ([0-9\-]+), flavor ([0-9\-]+), texture ([0-9\-]+), calories ([0-9\-]+)")

ingredients = {}
for line in open('input.txt', 'r'):
    (name, capacity, durability, flavor, texture, calories) = descriptions.match(line).groups()
    ingredients[name] = {
        'capacity': int(capacity),
        'durability': int(durability),
        'flavor': int(flavor),
        'texture': int(texture),
        'calories': int(calories),
        'spoons': 0
    }

def calculate_score(ingredients):
    properties = ['capacity', 'durability', 'flavor', 'texture']
    score = 1
    for prop in properties:
        total = calculate_property(prop, ingredients)

        # Early bail out, because we multiply all the totals together        
        if total < 0:
            return 0

        score *= total

    return score

def calculate_property(property, ingredients):
    return sum([ingredient[property] * ingredient['spoons'] for (name, ingredient) in ingredients.items()])

def generate_ingredient_combos(names, ingredients, highest, calories=False):
    # Figure out spoons already assigned to previous ingredients
    total_spoons = sum([ingredient['spoons'] for (name, ingredient) in ingredients.items() if name not in names])

    if len(names) == 0:
        new_score = calculate_score(ingredients)
        
        if new_score > highest and (calories is False or calculate_property('calories', ingredients) == calories):
            highest = new_score
    else: 
        # Lets only generate number_of_cups in ranges that make sense
        # ie: if we're on the last ingredient, just fill the available space
        cups_remain = 100 - total_spoons
        limit = cups_remain - 1 if len(names) == 1 else -1
        
        for number_of_cups in range(cups_remain, limit, -1):
            name = names[0]
            rest = names[1:]
            
            ingredients[name]['spoons'] = number_of_cups
            new_score = generate_ingredient_combos(rest, ingredients, highest, calories)
            
            if new_score > highest:
                highest = new_score
    
    return highest
        
highest = generate_ingredient_combos(list(ingredients.keys()), ingredients, 0)
print("Highest: %d" % highest)

highest = generate_ingredient_combos(list(ingredients.keys()), ingredients, 0, 500)
print("Highest with only 500 calories: %d" % highest)