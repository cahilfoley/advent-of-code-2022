import { readFile } from "fs/promises";
import {
  Beacon,
  getExcludedRangesForRow,
  Position,
  Sensor,
} from "./helpers.js";

const GRID_SIZE = 4000000;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const sensors: Sensor[] = [];

  const lines = inputs.split(/\r?\n/g);

  const beacons: Record<string, Beacon> = {};

  const getOrCreateBeacon = (x: number, y: number): Beacon => {
    const key = `${x},${y}`;
    if (key in beacons) {
      return beacons[key];
    }

    const beacon = new Beacon(x, y);
    beacons[key] = beacon;
    return beacon;
  };

  for (const line of lines) {
    const { sensorX, sensorY, beaconX, beaconY } =
      /Sensor at x=(?<sensorX>.+), y=(?<sensorY>.+): closest beacon is at x=(?<beaconX>.+), y=(?<beaconY>.+)/i.exec(
        line
      )?.groups ?? {};
    const beacon = getOrCreateBeacon(+beaconX, +beaconY);
    sensors.push(new Sensor(+sensorX, +sensorY, beacon));
  }

  // Loop through each row
  for (let y = 0; y <= GRID_SIZE; y++) {
    // Get the exclusions for the row
    const rowExclusions = getExcludedRangesForRow(sensors, y);

    // Early exit if the whole row is excluded
    if (rowExclusions[0][0] <= 0 && rowExclusions[0][1] >= GRID_SIZE) continue;

    for (let x = 0; x <= GRID_SIZE; x++) {
      const excluded = rowExclusions.some(
        (exclusion) => x >= exclusion[0] && x <= exclusion[1]
      );
      if (!excluded) {
        const position = new Position(x, y);
        console.log(
          `Position found at ${position.x},${position.y}: Tuning frequency is ${position.tuningFrequency}`
        );
        return;
      }
    }
  }

  console.log("No position found");
}

run();
