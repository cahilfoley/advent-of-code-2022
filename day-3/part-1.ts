import { readFile } from "fs/promises";
import { getPriorityForItem } from "./helpers.js";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );
  const rucksacks = inputs.split(/\r?\n/g);

  let total = 0;

  for (const rucksack of rucksacks) {
    const compartment1 = new Set(
      rucksack.slice(0, Math.floor(rucksack.length / 2))
    );
    const compartment2 = new Set(
      rucksack.slice(Math.ceil(rucksack.length / 2))
    );

    for (const item of compartment1.values()) {
      if (compartment2.has(item)) {
        total += getPriorityForItem(item);
        break;
      }
    }
  }

  console.log(total);
}

run();
