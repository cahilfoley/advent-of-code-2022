import { readFile } from "fs/promises";
import { parseValves, search } from "./helpers.js";

const TOTAL_MINUTES = 26;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);
  const valves = parseValves(lines);

  const scores = search(valves, TOTAL_MINUTES);

  let max = 0;
  for (let i = 1; i < scores.length; i++) {
    for (let j = 0; j < i; j++) {
      if (scores[j][1] * 2 < max) break;

      const hashA = scores[i][0];
      const hashB = scores[j][0];

      if (hashA & hashB) continue;

      const total = scores[i][1] + scores[j][1];

      max = Math.max(max, total);
    }
  }

  console.log(max);
}

run();
