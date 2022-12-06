import { readFile } from "fs/promises";
import { findIndexOfUniqueString } from "./helpers.js";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const endIndex = findIndexOfUniqueString(inputs, 14);
  console.log(endIndex + 1);
}

run();
