#[aoc_generator(day01)]
pub fn input_generator(input: &str) -> Vec<i32> {
    input
        .lines()
        .map(|line| {
            let number: i32 = line.parse().expect(&format!("{} not a number", line));
            number
        })
        .collect()
}

#[aoc(day01, part1)]
pub fn solve_part1(input: &[i32]) -> i32 {
    input.iter().sum()
}

#[aoc(day01, part2)]
pub fn solve_part2(input: &[i32]) -> i32 {
    let mut frequency: i32 = 0;
    let mut frequencies: Vec<i32> = Vec::new();
    let mut index = 0;

    loop {
        let change: i32 = input[index];

        if frequencies.iter().find(|&&i| i == frequency).is_some() {
            return frequency;
        }

        frequencies.push(frequency);
        frequency = frequency + change;

        index = index + 1;
        if index == input.len() {
            index = 0;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_1_1() {
        assert_eq!(solve_part1(&input_generator("+1\n+1\n+1")), 3)
    }
    
    #[test]
    fn example_1_2() {
        assert_eq!(solve_part1(&input_generator("+1\n+1\n-2")), 0)
    }

    #[test]
    fn example_1_3() {
        assert_eq!(solve_part1(&input_generator("-1\n-2\n-3")), -6)
    }

    #[test]
    fn example_2_1() {
        assert_eq!(solve_part2(&input_generator("+1\n-1")), 0)
    }

    #[test]
    fn example_2_2() {
        assert_eq!(solve_part2(&input_generator("+3\n+3\n+4\n-2\n-4")), 10)
    }

    #[test]
    fn example_2_3() {
        assert_eq!(solve_part2(&input_generator("-6\n+3\n+8\n+5\n-6")), 5)
    }

    #[test]
    fn example_2_4() {
        assert_eq!(solve_part2(&input_generator("+7\n+7\n-2\n-7\n-4")), 14)
    }
}
