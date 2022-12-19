import { readFile } from "fs/promises";
import { parseValves, search } from "./helpers.js";

const TOTAL_MINUTES = 30;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);
  const valves = parseValves(lines);

  const scores = search(valves, TOTAL_MINUTES);
  console.log(scores[0][1]);
}

run();
