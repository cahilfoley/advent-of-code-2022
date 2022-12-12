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

  let shortestPath = grid.findAStarPath(from, to);

  for (const row of grid.coordinates) {
    for (const coord of row) {
      if (coord.height === "a") {
        const path = grid.findAStarPath(coord, to);

        if (DEBUG_LOGGING) {
          console.log(
            `\nChecking for a path from ${coord.x},${coord.y} to ${to.x},${to.y}`
          );
        }

        if (!path) {
          if (DEBUG_LOGGING) console.log("No path found");
          continue;
        }

        if (DEBUG_LOGGING) {
          path.printPath();
          console.log(`The path found has a length of ${path.length}`);
        }

        if (!shortestPath || path.length < shortestPath.length) {
          shortestPath = path;
        }
      }
    }
  }

  console.log(shortestPath?.length ?? "No answer");
}

run();
