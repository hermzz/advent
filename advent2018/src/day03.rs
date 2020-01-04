use regex::Regex;

pub struct Claim {
    id: u32,
    left: u32,
    top: u32,
    width: u32,
    height: u32
}

#[aoc_generator(day03)]
pub fn input_generator(input: &str) -> Vec<Claim> {
    let box_regex = Regex::new(r"#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)").unwrap();

    input
        .lines()
        .map(|line| {
            let captures = box_regex.captures(line).unwrap();
            Claim {
                id: captures[1].parse().unwrap(),
                left: captures[2].parse().unwrap(),
                top: captures[3].parse().unwrap(),
                width: captures[4].parse().unwrap(),
                height: captures[5].parse().unwrap()
            }
        })
        .collect()
}

#[aoc(day03, part1)]
pub fn solve_part1(claims: &Vec<Claim>) -> u32 {
    let (width, height) = get_cloth_dimensions(&claims);

    let mut overlap: u32 = 0;
    for i in 0..width {
        for j in 0..height {
            let mut counter: u8 = 0;
            for claim in claims {
                if is_in_box(&i, &j, &claim) {

                    counter += 1;

                    if counter == 2 {
                        overlap += 1;
                        break;    
                    }
                }
            }
        }
    }

    overlap
}

pub fn get_cloth_dimensions(claims: &[Claim]) -> (u32, u32) {
    let mut height: u32 = 0;
    let mut width: u32 = 0;

    for claim in claims {
        if claim.top + claim.height > height {
            height = claim.top + claim.height;
        }

        if claim.left + claim.width > width {
            width = claim.left + claim.width
        }
    }

    (width, height)
}

pub fn is_in_box(x: &u32, y: &u32, box1: &Claim) -> bool {
    x >= &box1.left && x < &(box1.left + box1.width) &&
    y >= &box1.top && y < &(box1.top + box1.height)
}

#[aoc(day03, part2)]
pub fn solve_part2(claims: &Vec<Claim>) -> u32
{
    let mut answer: u32 = 0;

    for i in 0..claims.len() {
        let mut counter = 0;

        println!("{} overlaps with", claims[i].id);
        for j in 0..claims.len() {
            if i != j && overlaps(&claims[i], &claims[j]) {
                println!("\tBox {}", claims[j].id);
                counter += 1
            }
        }

        if counter == 0 {
            println!("Nothing!");
            answer = claims[i].id
        }
    }

    answer
}

pub fn overlaps(claim1: &Claim, claim2: &Claim) -> bool
{
    let mut overlaps: bool = false;

    'outer: for x in 0..claim1.width {
        for y in 0..claim1.height {
            if is_in_box(&(claim1.left + x), &(claim1.top + y), &claim2) {
                overlaps = true;
                break 'outer;
            }
        }
    }

    overlaps
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn day03_part1() {
        let box1 = Claim {id: 1, left: 1, top: 3, width: 4, height: 4};
        let box2 = Claim {id: 2, left: 3, top: 1, width: 4, height: 4};
        let box3 = Claim {id: 3, left: 5, top: 5, width: 2, height: 2};
        
        assert_eq!(is_in_box(&2, &4, &box1), true);
        assert_eq!(is_in_box(&0, &3, &box1), false);
        assert_eq!(is_in_box(&1, &2, &box1), false);
        assert_eq!(is_in_box(&6, &2, &box1), false);
        assert_eq!(is_in_box(&2, &9, &box1), false);

        assert_eq!(solve_part1(&vec![box1, box2, box3]), 4);
    }

    #[test]
    fn day03_part2() {
        let box1 = Claim {id: 1, left: 1, top: 3, width: 4, height: 4};
        let box2 = Claim {id: 2, left: 3, top: 1, width: 4, height: 4};
        let box3 = Claim {id: 3, left: 5, top: 5, width: 2, height: 2};

        assert_eq!(overlaps(&box1, &box2), true);
        assert_eq!(overlaps(&box1, &box3), false);
        assert_eq!(overlaps(&box2, &box3), false);

        assert_eq!(solve_part2(&vec![box1, box2, box3]), 3);
    }
}
