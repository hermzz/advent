#[aoc_generator(day6)]
fn input_generator(input: &str) -> Vec<char> {
    input.chars().collect()
}

pub fn unique_chars(chars: &[char]) -> bool {
    chars.iter().enumerate().fold(false, |acc, (i, c)| {
        acc || match chars[i+1..].iter().position(|p| p == c) {
            Some(_pos) => true,
            None => false
        }
    })
}

pub fn find_distinct_chars(chars: &Vec<char>, n: usize) -> usize {
    match chars.iter().enumerate().position(|(i, _c)| {
        if i + n > chars.len() {
            return false;
        }

        !unique_chars(&chars[i..i+n])
    }) {
        Some(pos) => pos + n,
        None => panic!("Woops")
    }
}

#[aoc(day6, part1)]
fn part1(chars: &Vec<char>) -> usize {
    find_distinct_chars(chars, 4)
}

#[aoc(day6, part2)]
fn part2(chars: &Vec<char>) -> usize {
    find_distinct_chars(chars, 14)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_6_1() {
        assert_eq!(part1(&input_generator("mjqjpqmgbljsphdztnvjfqwrcgsmlb")), 7);
        assert_eq!(part1(&input_generator("bvwbjplbgvbhsrlpgdmjqwftvncz")), 5);
        assert_eq!(part1(&input_generator("nppdvjthqldpwncqszvftbrmjlhg")), 6);
        assert_eq!(part1(&input_generator("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")), 10);
        assert_eq!(part1(&input_generator("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")), 11);
    }

    #[test]
    fn example_6_2() {
        assert_eq!(part2(&input_generator("mjqjpqmgbljsphdztnvjfqwrcgsmlb")), 19);
        assert_eq!(part2(&input_generator("bvwbjplbgvbhsrlpgdmjqwftvncz")), 23);
        assert_eq!(part2(&input_generator("nppdvjthqldpwncqszvftbrmjlhg")), 23);
        assert_eq!(part2(&input_generator("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")), 29);
        assert_eq!(part2(&input_generator("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")), 26);
    }
}