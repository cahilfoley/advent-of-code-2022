import { readFile } from "fs/promises";
import { parseInputs, printStackMove } from "./helpers.js";

const DEBUG_LOGGING = false;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const { stacks, moves } = parseInputs(inputs);

  for (const { count, from, to, text } of moves) {
    let before: string[][] = [];

    if (DEBUG_LOGGING) {
      before = [...stacks.map((stack) => [...stack])];
    }

    for (let i = 0; i < count; i++) {
      const item = stacks[from].pop();
      stacks[to].push(item!);
    }

    if (DEBUG_LOGGING) {
      printStackMove(text, before, stacks);
    }
  }

  console.log(stacks.map((stack) => stack[stack.length - 1]).join(""));
}

run();
