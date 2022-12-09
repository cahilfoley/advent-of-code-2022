import { readFile } from "fs/promises";
import { Direction, Point } from "./helpers.js";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);
  const visitedCoordinates = new Set();
  const head = new Point(0, 0);
  const tail = new Point(0, 0);

  for (const line of lines) {
    const [direction, distance] = line.split(" ");
    for (let i = 0; i < Number(distance); i++) {
      head.move(direction as Direction);
      tail.follow(head);
      visitedCoordinates.add(`${tail.x},${tail.y}`);
    }
  }

  console.log(visitedCoordinates.size);
}

run();
