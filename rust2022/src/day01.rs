
type Calories = Vec<u32>;
type CaloryGroup = Vec<Calories>;

#[aoc_generator(day1)]
fn input_generator(input: &str) -> CaloryGroup {
    let mut calory_group: CaloryGroup = Vec::new();
    let mut accumulator: Calories = Vec::new();

    input.split("\n").for_each(|v| {
        if v == "" {
          calory_group.push(accumulator.clone());
          accumulator = Vec::new();
          return;
        }

        accumulator.push(v.parse::<u32>().unwrap());
    });

    calory_group.push(accumulator.clone());

    calory_group
}

pub fn calc_total(calories: &Calories) -> u32 {
    calories.into_iter().fold(0, |acc, elem| acc + elem)
}

pub fn find_max_calories(calory_group: &CaloryGroup) -> u32 {
    calory_group.into_iter().fold(0, |acc, elem| match calc_total(elem) > acc {
        true => calc_total(elem),
        false => acc
    })
}

pub fn sort_desc(mut calory_group: CaloryGroup) -> CaloryGroup {
    calory_group.sort_by(|a, b| calc_total(b).cmp(&calc_total(a)));
    calory_group.to_vec()
}

pub fn get_top_groups(calory_group: &CaloryGroup, n: usize) -> CaloryGroup {
    sort_desc(calory_group.to_vec())[0..n].to_vec()
}

#[aoc(day1, part1)]
fn part1(calory_group: &CaloryGroup) -> u32 {
    find_max_calories(calory_group)
}

#[aoc(day1, part2)]
fn part2(calory_group: &CaloryGroup) -> u32 {
    get_top_groups(calory_group, 3)
    .into_iter()
    .fold(0, |acc, elem| acc + calc_total(&elem))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_1_1() {
        assert_eq!(part1(&input_generator("1000\n2000\n3000\n\n4000\n\n5000\n6000\n\n7000\n8000\n9000\n\n10000")), 24000)
    }

    #[test]
    fn example_1_2() {
        assert_eq!(part2(&input_generator("1000\n2000\n3000\n\n4000\n\n5000\n6000\n\n7000\n8000\n9000\n\n10000")), 45000)
    }
}