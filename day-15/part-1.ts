import { readFile } from "fs/promises";
import { Beacon, getExcludedRangesForRow, Sensor } from "./helpers.js";

const TARGET_ROW = 2000000;

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const sensors: Sensor[] = [];

  const lines = inputs.split(/\r?\n/g);

  for (const line of lines) {
    const { sensorX, sensorY, beaconX, beaconY } =
      /Sensor at x=(?<sensorX>.+), y=(?<sensorY>.+): closest beacon is at x=(?<beaconX>.+), y=(?<beaconY>.+)/i.exec(
        line
      )?.groups ?? {};
    const beacon = new Beacon(+beaconX, +beaconY);
    sensors.push(new Sensor(+sensorX, +sensorY, beacon));
  }

  const ranges = getExcludedRangesForRow(sensors, TARGET_ROW);

  const totalExcludedPositions = ranges.reduce(
    (total, range) => total + Math.abs(range[0] - range[1]),
    0
  );

  console.log(totalExcludedPositions);
}

run();
