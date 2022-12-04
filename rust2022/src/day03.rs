type Compartment = Vec<u32>;
type Compartments = (Compartment, Compartment);
type Rucksack = Vec<u32>;

pub fn char_to_priority(c: char) -> u32 {
    match c {
        'a'..='z' => c as u32 - 'a' as u32 + 1,
        'A'..='Z' => c as u32 - 'A' as u32 + 27,
        _ => panic!("Oops")
    }
}

pub fn find_common_items(c1: &Compartment, c2: &Compartment) -> Vec<u32> {
    c1.iter().filter(|o| { c2.iter().any(|p| o.clone() == p) }).map(|o| o.clone()).collect()
}

#[aoc_generator(day3)]
fn input_generator(input: &str) -> Vec<Rucksack> {
    input.split("\n").map(|line| { line.chars().map(|c| { char_to_priority(c) }).collect() }).collect()
}

#[aoc(day3, part1)]
fn part1(rucksacks: &Vec<Rucksack>) -> u32 {
    let rucksack_compartments = |r: &Rucksack| -> Compartments { (r[0..r.len() / 2].to_vec(), r[r.len() / 2..].to_vec()) };

    rucksacks
        .iter()
        .map(rucksack_compartments)
        .map(|r| { find_common_items(&r.0, &r.1) })
        .fold(0, |acc, elem| { acc + elem[0] })
}

#[aoc(day3, part2)]
fn part2(rucksacks: &Vec<Rucksack>) -> u32 {
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