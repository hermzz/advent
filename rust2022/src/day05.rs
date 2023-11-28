use std::collections::VecDeque;
use std::iter::FromIterator;

type Crate = String;
type Stack = VecDeque<Crate>;
type Container = Vec<Stack>;

#[derive(Debug)]
pub struct Instruction {
  n: usize,
  from: usize,
  to: usize
}

pub fn parse_input_stack(lines: Vec<&str>) -> Container {

    let mut container = vec![VecDeque::<Crate>::new(); (lines[0].len() as f64 / 4 as f64).ceil() as usize];
   
    for line in &lines[0..lines.len()-1] {
        let chars = Vec::from_iter(line.split("").filter(|el| el.clone() != "").into_iter());
        let chunks = chars.chunks(4);
        for (i, part) in chunks.enumerate() {
            if part[1] != " " {
                container[i].push_front(part[1].to_string());
            }
        }
    }

    println!("{:#?}", container);
    container
}

pub fn parse_instruction(line: &str) -> Instruction {
    let mut elem = line.split(" ");
    Instruction {
        n: elem.nth(1).unwrap().parse::<usize>().unwrap(),
        from: elem.nth(1).unwrap().parse::<usize>().unwrap(),
        to: elem.nth(1).unwrap().parse::<usize>().unwrap()
    }
}

#[aoc_generator(day5)]
fn input_generator(input: &str) -> (Container, Vec<Instruction>) {
    let mut parts = input.split("\n\n");
    (
        parse_input_stack(parts.nth(0).unwrap().split("\n").collect::<Vec<&str>>()),
        parts.nth(0).unwrap().split("\n").map(|line| parse_instruction(line)).collect()
    )
}

pub fn create_mover_9000(mut container: &Container, instruction: &Instruction) {
    //container[instruction.from].splice(instruction.n * -1).reverse().forEach(x => container[instruction.to].push(x));
    container[instruction.from];
}

#[aoc(day5, part1)]
fn part1(input: &(Container, Vec<Instruction>)) -> String {
    for instruction in &input.1 {
        create_mover_9000(&input.0, instruction);
    }
    //return container.map(stack => stack.slice(-1)[0]).join("");
    println!("{:#?}", input.1);
    "".to_string()
}

/*#[aoc(day5, part2)]
fn part2(sections: &(Container, [Instruction])) -> String {
    "".to_string()
}*/

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_4_1() {
        assert_eq!(part1(&input_generator("    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2")), "CMZ")
    }

    /*#[test]
    fn example_4_2() {
        assert_eq!(part2(&input_generator(r#"    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2"#)), "MCD")
    }*/
}