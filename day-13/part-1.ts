import { readFile } from "fs/promises";
import { compareMessages } from "./helpers.js";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const pairs = inputs.split(/\r?\n\r?\n/g);

  let total = 0;

  for (let i = 0; i < pairs.length; i++) {
    const pairNumber = i + 1;
    const [left, right] = pairs[i]
      .split(/\r?\n/g)
      .map((line) => JSON.parse(line));
    const result = [left, right].sort(compareMessages);

    // Nothing changed, add index to total
    if (result[0] === left) {
      total += pairNumber;
    }
  }

  console.log(total);
}

run();
