export class Position {
  constructor(public x: number, public y: number) {}

  get tuningFrequency() {
    return this.x * 4000000 + this.y;
  }

  getDistanceTo(target: Position): number {
    return Math.abs(this.x - target.x) + Math.abs(this.y - target.y);
  }
}

export class Sensor extends Position {
  constructor(public x: number, public y: number, public beacon: Beacon) {
    super(x, y);
  }

  get exclusionRadius() {
    return this.getDistanceTo(this.beacon);
  }
}

export class Beacon extends Position {}

export type Range = [number, number];

export function mergeOverlappingRanges(ranges: Range[]): Range[] {
  // Sort the ranges in ascending order
  ranges.sort((a, b) => a[0] - b[0]);

  // Initialize a new array to hold the merged ranges
  const mergedRanges = [ranges[0]];

  // Loop through the ranges and merge any overlapping ranges
  for (let i = 1; i < ranges.length; i++) {
    const currentRange = ranges[i];
    const lastMergedRange = mergedRanges[mergedRanges.length - 1];

    // Check if the current range is overlapping with the last merged range
    if (currentRange[0] <= lastMergedRange[1]) {
      // Merge the current range with the last merged range
      lastMergedRange[1] = Math.max(currentRange[1], lastMergedRange[1]);
    } else {
      // Add the current range to the array of merged ranges
      mergedRanges.push(currentRange);
    }
  }

  return mergedRanges;
}

export function getExcludedRangesForRow(sensors: Sensor[], y: number): Range[] {
  const ranges: Range[] = [];

  for (const sensor of sensors) {
    // Exclusion radius doesn't get close, don't check
    if (Math.abs(sensor.y - y) > sensor.exclusionRadius) continue;

    const overlap = sensor.exclusionRadius - Math.abs(sensor.y - y);
    const width = overlap * 2 + 1;
    ranges.push([
      sensor.x - Math.floor(width / 2),
      sensor.x + Math.floor(width / 2),
    ]);
  }

  return mergeOverlappingRanges(ranges);
}
