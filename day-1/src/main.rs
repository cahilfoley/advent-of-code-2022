use clap::Parser;
use regex::Regex;
use std::fs::File;
use std::io::prelude::*;
use std::vec::Vec;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Which part to run, can be either 1 or 2
    #[arg(short, long, default_value_t = 1)]
    part: u8,
}

fn main() {
    let args = Args::parse();

    let mut file = File::open("inputs.txt").unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();

    let single_line_separator = Regex::new(r"\r?\n").unwrap();
    let multi_line_separator = Regex::new(r"\r?\n\r?\n").unwrap();
    let elves: Vec<_> = multi_line_separator.split(&contents).into_iter().collect();

    if args.part == 1 {
        let mut max = 0;

        for elf in elves {
            let mut total = 0;
            let lines: Vec<_> = single_line_separator.split(elf).into_iter().collect();
            for line in lines {
                let value: i32 = line.parse().unwrap();
                total += value;
            }

            if total > max {
                max = total;
            }
        }

        println!("The max for an elf is: {:?}", max);
    } else if args.part == 2 {
        let mut totals = [0; 3];

        for elf in elves {
            let mut elf_total = 0;
            let lines: Vec<_> = single_line_separator.split(elf).into_iter().collect();
            for line in lines {
                let value: i32 = line.parse().unwrap();
                elf_total += value;
            }

            for (i, total) in totals.iter().enumerate() {
                if total < &elf_total {
                    for j in 2..i {
                        totals[j] = totals[j - 1];
                    }

                    totals[i] = elf_total;
                    break;
                }
            }
        }

        println!(
            "The max for the top 3 elves is: {:?}",
            totals.iter().sum::<i32>()
        );
    } else {
        println!("No idea which part you are talking about");
    }
}
