#[derive(PartialEq)]
#[derive(Clone)]
#[derive(Eq)]
pub enum Choice {
    Rock,
    Paper,
    Scissors
}

pub struct Game {
    opponent: Choice,
    mine: Choice
}

type InputLine = (char, char);

const CHOICES: &'static [Choice] = &[Choice::Rock, Choice::Paper, Choice::Scissors];

pub fn wins(choice: Choice) -> Choice {
    match choice {
        Choice::Rock => Choice::Scissors,
        Choice::Scissors => Choice::Paper,
        Choice::Paper => Choice::Rock
    }
}

pub fn choice_map(input: char) -> Choice {
    match input {
        'A' | 'X' => Choice::Rock,
        'B' | 'Y' => Choice::Paper,
        'C' | 'Z' => Choice::Scissors,
        _ => panic!("Yikes")
    }
}

pub fn predict_choice(result: char, choice: Choice) -> Choice {
    match result {
        'X' => wins(choice),
        'Y' => choice,
        'Z' => wins(wins(choice)),
        _ => panic!("Woops")
    }
}

pub fn create_game(line: &InputLine) -> Game {
    Game { opponent: choice_map(line.0), mine: choice_map(line.1)}
}

pub fn create_predicted_game(line: &InputLine) -> Game {
    Game { opponent: choice_map(line.0), mine: predict_choice(line.1, choice_map(line.0))}
}

pub fn find_choice(choice: Choice) -> u32 {
    match CHOICES.iter().position(|c| c.clone() == choice) {
        Some(c) => c as u32 +1,
        None => panic!("Crap")
    }
}

pub fn calculate_outcome(game: Game) -> u32 {
    if game.opponent == game.mine {
        return find_choice(game.mine.clone()) + 3;
    }

    find_choice(game.mine.clone()) + match wins(game.mine) == game.opponent {
        true => 6,
        false => 0
    }
}

#[aoc_generator(day2)]
fn input_generator(input: &str) -> Vec<InputLine> {
    input.split("\n").map(|line: &str| -> InputLine {
        let elements: Vec<char> = line.split(" ").map(|c| c.chars().next().unwrap()).collect();
        (elements[0], elements[1])
    }).collect()
}

#[aoc(day2, part1)]
fn part1(games: &Vec<InputLine>) -> u32 {
   games.iter().map(|line| create_game(line)).fold(0, |acc, game| { acc + calculate_outcome(game) })
}

#[aoc(day2, part2)]
fn part2(games: &Vec<InputLine>) -> u32 {
   games.iter().map(|line| create_predicted_game(line)).fold(0, |acc, game| { acc + calculate_outcome(game) })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_2_1() {
        assert_eq!(part1(&input_generator("A Y\nB X\nC Z")), 15)
    }

    #[test]
    fn example_2_2() {
        assert_eq!(part2(&input_generator("A Y\nB X\nC Z")), 12)
    }
}