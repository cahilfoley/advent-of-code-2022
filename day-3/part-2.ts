import { readFile } from "fs/promises";
import { getPriorityForItem } from "./helpers.js";

const GROUP_SIZE = 3;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );
  const rucksacks = inputs.split(/\r?\n/g);
  const groups: string[][] = [];

  // Split the inputs into groups of 3
  for (let i = 0; i < rucksacks.length; i++) {
    const position = i % GROUP_SIZE;
    const group = Math.floor(i / GROUP_SIZE);

    if (position === 0) groups.push([]);
    groups[group][position] = rucksacks[i];
  }

  let total = 0;

  for (const group of groups) {
    const sack1 = new Set(group[0]);
    const sack2 = new Set(group[1]);
    const sack3 = new Set(group[2]);

    for (const character of sack1) {
      if (sack2.has(character) && sack3.has(character)) {
        total += getPriorityForItem(character);
        break;
      }
    }
  }

  console.log(total);
}

run();
