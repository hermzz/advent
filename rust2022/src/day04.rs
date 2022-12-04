#[derive(Clone)]
#[derive(Copy)]
#[derive(Debug)]
pub struct Range {
    start: u32,
    end: u32
}

type Section = (Range, Range);

#[aoc_generator(day4)]
fn input_generator(input: &str) -> Vec<Section> {
    let parse_range = |elem: &str| {
        let mut comp = elem.split("-");
        Range {
            start: comp.nth(0).unwrap().parse::<u32>().unwrap(),
            end: comp.nth(0).unwrap().parse::<u32>().unwrap()
        }
    };

    input.split("\n").map(|line| {
        let mut elem = line.split(",");
        (parse_range(elem.nth(0).unwrap()), parse_range(elem.nth(0).unwrap()))
    }).collect()
}

pub fn is_contained_within(r1: Range, r2: Range) -> bool {
    r1.start <= r2.start && r1.end >= r2.end
}

pub fn some_overlap(r1: Range, r2: Range) -> bool {
  is_contained_within(r1, r2) ||
  is_contained_within(r2, r1) || // I think this is needed but tests pass without it...
  (r1.start >= r2.start && r1.start <= r2.end) ||
  (r1.end >= r2.start && r1.end <= r2.end)
}

#[aoc(day4, part1)]
fn part1(sections: &Vec<Section>) -> u32 {
    sections.iter().fold(0, |prev, section| {
        prev + match is_contained_within(section.0, section.1) || is_contained_within(section.1, section.0) {
            true => 1,
            false => 0
        }
    })
}

#[aoc(day4, part2)]
fn part2(sections: &Vec<Section>) -> u32 {
    sections.iter().fold(0, |prev, section| {
        prev + match some_overlap(section.0, section.1) {
            true => 1,
            false => 0
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_4_1() {
        assert_eq!(part1(&input_generator("2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8")), 2)
    }

    #[test]
    fn example_4_2() {
        assert_eq!(part2(&input_generator("2-4,6-8\n2-3,4-5\n5-7,7-9\n2-8,3-7\n6-6,4-6\n2-6,4-8")), 4)
    }
}