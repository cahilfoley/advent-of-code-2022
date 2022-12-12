import { readFile } from "fs/promises";
import { Grid } from "./helpers.js";

const DEBUG_LOGGING = false;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const grid = Grid.fromInput(inputs);

  const { from, to } = grid;
  if (!from || !to) {
    throw new Error("Unable to find start or end");
  }
  const path = grid.findAStarPath(from, to);

  if (DEBUG_LOGGING) {
    console.log(
      `Path found from ${from.x},${from.y} to ${to.x},${to.y} in ${path?.length} steps`
    );
    path?.printPath();
  }

  console.log(path?.length ?? "No result");
}

run();
