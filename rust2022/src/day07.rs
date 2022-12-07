#[derive(Debug)]
pub struct Node {
    parent: Option<usize>,
    children: Vec<usize>,
    size: usize
}

pub fn calculate_size(nodes: &Vec<Node>, node: usize) -> usize {
    nodes[node].children.iter().fold(0, |acc, elem| acc + nodes[*elem].size)
}

#[aoc_generator(day7)]
fn input_generator(input: &str) -> Vec<Node> {
    let mut nodes: Vec<Node> = Vec::new();
    nodes.push(Node { parent: None, children: Vec::new(), size: 0 });
    let mut curr_node = Some(0);

    input.split("\n").enumerate().for_each(|(i, line)| {
        if i == 0 {
            return ();
        }

        let elem: Vec<&str> = line.split(" ").collect();
        match elem[0] {
            "$" => match elem[1] {
                "cd" => match elem[2] {
                    ".." => {
                        nodes[curr_node.unwrap()].size = calculate_size(&nodes, curr_node.unwrap());
                        curr_node = nodes[curr_node.unwrap()].parent;
                    }, // down dir
                    _ => {
                        nodes.push(Node { parent: curr_node, children: Vec::new(), size: 0});
                        curr_node = Some(nodes.len() - 1);
                        let parent = nodes[curr_node.unwrap()].parent.unwrap();
                        nodes[parent].children.push(curr_node.unwrap())
                    } // up dir
                },
                _ => {} // ls

            },
            "dir" => {}
            _ => {
                // new elem
                let new_node = Node { parent: curr_node, children: Vec::new(), size: elem[0].parse::<usize>().unwrap()};
                nodes.push(new_node);
                let new_index = nodes.len() - 1;
                nodes[curr_node.unwrap()].children.push(new_index);
            }
        };
    });

    while nodes[curr_node.unwrap()].parent != None {
        nodes[curr_node.unwrap()].size = calculate_size(&nodes, curr_node.unwrap());
        curr_node = nodes[curr_node.unwrap()].parent;
    }

    nodes[0].size = calculate_size(&nodes, 0);

    println!("{:#?}", nodes.len());
    nodes
}

#[aoc(day7, part1)]
fn part1(dirs: &Vec<Node>) -> usize {
    dirs.iter()
        .filter(|node| node.children.len() > 0 && node.size <= 100_000)
        .fold(0, |acc, elem| acc + elem.size)
}

#[aoc(day7, part2)]
fn part2(dirs: &Vec<Node>) -> usize {
    let min_size = 30000000 - (70000000 - dirs[0].size);
    dirs
        .iter()
        .filter(|node| node.children.len() > 0 && node.size >= min_size)
        .fold(70000000, |acc, elem| match acc > elem.size {
            true => elem.size,
            false => acc
        })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example_7_1() {
        assert_eq!(part1(&input_generator("$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k")), 95437);
    }

    #[test]
    fn example_6_2() {
        assert_eq!(part2(&input_generator("$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k")), 24933642);
    }
}