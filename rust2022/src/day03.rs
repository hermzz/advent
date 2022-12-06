type Compartment<'a> = &'a [usize];
type Rucksack = Vec<usize>;

pub fn char_to_priority(c: char) -> usize {
    match c {
        'a'..='z' => c as usize - 'a' as usize + 1,
        'A'..='Z' => c as usize - 'A' as usize + 27,
        _ => panic!("Oops")
    }
}

pub fn find_common_items(c1: Compartment, c2: Compartment) -> Vec<usize> {
    c1.iter().map(|o| o.clone()).filter(|o| { c2.iter().any(|p| o == p) }).collect()
}

#[aoc_generator(day3)]
fn input_generator(input: &str) -> Vec<Rucksack> {
    input.split("\n").map(|line| { line.chars().map(|c| { char_to_priority(c) }).collect() }).collect()
}

#[aoc(day3, part1)]
fn part1(rucksacks: &Vec<Rucksack>) -> usize {
    rucksacks
        .iter()
        .map(|r| r.split_at(r.len() / 2))
        .map(|r| { find_common_items(&r.0, &r.1) })
        .fold(0, |acc, elem| { acc + elem[0] })
}

#[aoc(day3, part2)]
fn part2(rucksacks: &Vec<Rucksack>) -> usize {
    rucksacks
        .chunks(3)
        .into_iter()
        .map(|group| { find_common_items(&find_common_items(&group[0], &group[1]), &group[2])})
        .fold(0, |acc, elem| { acc + elem[0] })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_3_1() {
        assert_eq!(part1(&input_generator("vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw")), 157)
    }

    #[test]
    fn test_char_to_priority() {
        assert_eq!(char_to_priority('p'), 16);
        assert_eq!(char_to_priority('L'), 38);
    }

    #[test]
    fn example_3_2() {
        assert_eq!(part2(&input_generator("vJrwpWtwJgWrhcsFMMfFFhFp\njqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL\nPmmdzqPrVvPwwTWBwg\nwMqvLMZHhHMvwLHjbvcjnnSBnvTQFn\nttgJtRGJQctTZtZT\nCrZsJsPPZsGzwwsLwLmpwMDw")), 70)
    }
}