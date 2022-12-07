import { readFile } from "fs/promises";
import {
  parseCommandsIntoTree,
  sumDirectoriesLessThanLimit,
} from "./helpers.js";

const MAX_SIZE = 100000;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);

  const tree = parseCommandsIntoTree(lines);
  console.log(sumDirectoriesLessThanLimit(tree, MAX_SIZE));
}

run();
