import { readFile } from "fs/promises";
import { Direction, Point } from "./helpers.js";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);
  const visitedCoordinates = new Set();
  const knots = Array.from({ length: 10 }).map((knot) => new Point(0, 0));

  for (const line of lines) {
    const [direction, distance] = line.split(" ");
    for (let i = 0; i < Number(distance); i++) {
      knots[0].move(direction as Direction);
      for (let j = 1; j < knots.length; j++) {
        knots[j].follow(knots[j - 1]);
      }

      visitedCoordinates.add(`${knots[9].x},${knots[9].y}`);
    }
  }

  console.log(visitedCoordinates.size);
}

run();
