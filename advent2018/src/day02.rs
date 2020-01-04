use std::collections::HashMap;

#[aoc(day02, part1)]
pub fn solve_part1(input: &str) -> u32 {
    let doubles: u32 = input.lines().map(|line| count_repetitions(line, 2)).sum();
    let triples: u32 = input.lines().map(|line| count_repetitions(line, 3)).sum();
    
    doubles * triples
}

pub fn count_repetitions(input: &str, limit: u32) -> u32 {
    let mut letters = HashMap::new();

    for c in input.chars() {
        let count = letters.entry(c).or_insert(0);
        *count += 1;
    }

    for (_letter, count) in letters {
        if count == limit {
            return 1
        }
    }

    0
}

#[aoc(day02, part2)]
pub fn solve_part2(input: &str) -> String {
    let mut found = String::new();
    let lines: Vec<&str> = input.lines().collect();

    'outer: for index in 0..lines.len() {
        for index2 in index..lines.len() {
            let result = get_common(lines[index], lines[index2]);

             if result.len() == lines[index].len() - 1 {
                found.push_str(&result);
                break 'outer;
             } 
        }
    }

    found
}

pub fn get_common(str1: &str, str2: &str) -> String {
    let mut buf: Vec<u8> = Vec::new();
    let length = str1.len();
    let mut index: usize = 0;

    let str1bytes = str1.as_bytes();
    let str2bytes = str2.as_bytes();

    while index < length {
        if str1bytes[index] == str2bytes[index] {
            buf.push(str1bytes[index]);
        }

        index += 1
    }

    String::from_utf8(buf).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_1() {
        assert_eq!(count_repetitions("abcdef", 2), 0);
        assert_eq!(count_repetitions("abcdef", 3), 0);

        assert_eq!(count_repetitions("bababc", 2), 1);
        assert_eq!(count_repetitions("bababc", 3), 1);

        assert_eq!(count_repetitions("abbcde", 2), 1);
        assert_eq!(count_repetitions("abbcde", 3), 0);

        assert_eq!(count_repetitions("abcccd", 2), 0);
        assert_eq!(count_repetitions("abcccd", 3), 1);

        assert_eq!(count_repetitions("aabcdd", 2), 1);
        assert_eq!(count_repetitions("aabcdd", 3), 0);

        assert_eq!(count_repetitions("abcdee", 2), 1);
        assert_eq!(count_repetitions("abcdee", 3), 0);

        assert_eq!(count_repetitions("ababab", 2), 0);
        assert_eq!(count_repetitions("ababab", 3), 1);

        assert_eq!(solve_part1("abcdef\nbababc\nabbcde\nabcccd\naabcdd\nabcdee\nababab"), 12);
    }

    #[test]
    fn example_2() {
        assert_eq!(get_common("abcde", "axcye"), "ace");
        assert_eq!(get_common("fghij", "fguij"), "fgij");

        assert_eq!(solve_part2("abcde\nfghij\nklmno\npqrst\nfguij\naxcye\nwvxyz"), "fgij");
    }
}