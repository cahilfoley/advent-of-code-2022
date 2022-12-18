import { readFile } from "fs/promises";
import { Grid, Sand } from "./helpers.js";

const DEBUG_LOGGING = false;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);

  let maxX = 0;
  let maxY = 0;
  let minX = Infinity;
  let minY = Infinity;

  for (const line of lines) {
    for (const point of line.split(" -> ")) {
      const [x, y] = point.split(",");
      if (parseInt(x) > maxX) maxX = parseInt(x);
      if (parseInt(x) < minX) minX = parseInt(x);
      if (parseInt(y) > maxY) maxY = parseInt(y);
      if (parseInt(y) < minY) minY = parseInt(y);
    }
  }

  const grid = new Grid();
  grid.initialize(maxX, maxY);
  grid.drawRockLinesFromInputs(lines);

  let ended = false;
  let totalSandCount = 0;
  while (!ended) {
    const sand = new Sand(500, 0, grid);
    grid.setPoint(500, 0, sand);
    const intoAbyss = sand.fall();

    if (DEBUG_LOGGING) {
      console.log(`Sand: {x: ${sand.x}, y: ${sand.y}}`);
      grid.debugPrint(maxY);
    }

    if (intoAbyss) {
      ended = true;
    } else {
      totalSandCount++;
    }
  }

  console.log(totalSandCount);
}

run();
