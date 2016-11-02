#!/usr/bin/env python3

def count_on_neighbours(grid, row, column):
	on_neighbours = 0
	width = len(grid)
	height = len(grid[0])
	
	top = row > 0
	bottom = row < height - 1
	left = column > 0
	right = column < width - 1
	
	if top:
		on_neighbours += 1 if grid[row - 1][column] else 0
	if bottom:
		on_neighbours += 1 if grid[row + 1][column] else 0	
	if left:
		on_neighbours += 1 if grid[row][column - 1] else 0
	if right:
		on_neighbours += 1 if grid[row][column + 1] else 0
	if top and left:
		on_neighbours += 1 if grid[row - 1][column - 1] else 0
	if top and right:
		on_neighbours += 1 if grid[row - 1][column + 1] else 0
	if bottom and left:
		on_neighbours += 1 if grid[row + 1][column - 1] else 0
	if bottom and right:
		on_neighbours += 1 if grid[row + 1][column + 1] else 0
	
	return on_neighbours

def iterate_grid(grid):
	new_grid = []
	for row in range(0, len(grid)):
		new_grid += [[False] * len(grid[row])]
		for column in range(0, len(grid[row])):
			on_neighbours = count_on_neighbours(grid, row, column)
			
			if (row == 0 and column == 0) or (row == 0 and column == len(grid[0]) - 1) or (row == len(grid) - 1 and column == 0) or (row == len(grid) - 1 and column == len(grid[0]) - 1):
				new_grid[row][column] = True
			elif not grid[row][column] and on_neighbours == 3:
				new_grid[row][column] = True
			elif grid[row][column] and on_neighbours not in [2,3]:
				new_grid[row][column] = False
			else:
				new_grid[row][column] = grid[row][column]

	return new_grid

def pretty_grid(grid):
	for line in grid:
		print(''.join(['#' if light else '.' for light in line]))

grid = []
for line in open('input.txt', 'r'):
	grid += [[True if char == '#' else False for char in list(line.strip())]]

grid[0][0] = True
grid[0][len(grid[0]) - 1] = True
grid[len(grid) - 1][0] = True
grid[len(grid) - 1][len(grid[0]) -1] = True

iterations = 100
for r in range(1, iterations + 1):
	grid = iterate_grid(grid)

print("After %d iterations there are %d lights on" % (iterations, sum([sum([1 for column in row if column]) for row in grid])))