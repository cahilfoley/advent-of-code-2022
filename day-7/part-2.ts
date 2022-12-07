import { readFile } from "fs/promises";
import { parseCommandsIntoTree } from "./helpers.js";

const TOTAL_SPACE = 70000000;
const TARGET_FREE_SPACE = 30000000;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);
  const tree = parseCommandsIntoTree(lines);

  const allSizes = tree.getAllDirectorySizes();
  allSizes.sort((a, z) => a - z);

  const usedSize = tree.size;
  const targetSize = TARGET_FREE_SPACE - (TOTAL_SPACE - usedSize);

  for (const size of allSizes) {
    if (size > targetSize) {
      console.log(size);
      break;
    }
  }
}

run();
