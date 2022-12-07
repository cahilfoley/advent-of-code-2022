import { readFile } from "fs/promises";
import { parseCommandsIntoTree } from "./helpers.js";

const MAX_SIZE = 100000;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);

  const tree = parseCommandsIntoTree(lines);

  const result = tree
    .getAllDirectorySizes()
    .filter((size) => size < MAX_SIZE)
    .reduce((total, size) => total + size, 0);

  console.log(result);
}

run();
