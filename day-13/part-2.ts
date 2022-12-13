import { readFile } from "fs/promises";
import { Message, compareMessages } from "./helpers.js";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const pairs = inputs.split(/\r?\n\r?\n/g);
  const dividers: Message[] = [[[2]], [[6]]];
  const lines: Message[] = [
    ...pairs.flatMap((pair) =>
      pair.split(/\r?\n/g).map((line) => JSON.parse(line))
    ),
    ...dividers,
  ];

  lines.sort(compareMessages);

  for (const line of lines) {
    console.log(JSON.stringify(line));
  }

  const result = dividers.reduce<number>(
    (total, divider) => (lines.findIndex((x) => x === divider) + 1) * total,
    1
  );

  console.log(result);
}

run();
