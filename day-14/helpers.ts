interface Position {
  x: number;
  y: number;
}

export class Point implements Position {
  constructor(public x: number, public y: number, public grid: Grid) {}

  moveTo(x: number, y: number) {
    this.grid.movePoint(this.x, this.y, x, y);
    this.x = x;
    this.y = y;
  }
}

export class Rock extends Point {}

export class Sand extends Point {
  // Returns true if it hit the bottom
  fall(bottomOffset = 0): boolean {
    if (this.y + 1 >= this.grid.length - bottomOffset) return true;

    // If down is empty, move down
    const down = this.grid.getPoint(this.x, this.y + 1);
    if (!down) {
      this.moveTo(this.x, this.y + 1);
      return this.fall(bottomOffset);
    }

    const leftDown = this.grid.getPoint(this.x - 1, this.y + 1);
    if (!leftDown) {
      this.moveTo(this.x - 1, this.y + 1);
      return this.fall(bottomOffset);
    }

    const rightDown = this.grid.getPoint(this.x + 1, this.y + 1);
    if (!rightDown) {
      this.moveTo(this.x + 1, this.y + 1);
      return this.fall(bottomOffset);
    }

    return false;
  }
}

export class Grid {
  points: (Point | undefined)[][] = [];

  get length() {
    return this.points.length;
  }

  initialize(maxX: number, maxY: number) {
    for (let y = 0; y <= maxY; y++) {
      this.points[y] = [];
      for (let x = 0; x <= maxX; x++) {
        this.points[y][x] = undefined;
      }
    }
  }

  getPoint(x: number, y: number) {
    return this.points[y]?.[x];
  }

  setPoint(x: number, y: number, point?: Point) {
    if (!this.points[y]) {
      this.points[y] = [];
    }

    this.points[y][x] = point;
  }

  movePoint(fromX: number, fromY: number, toX: number, toY: number) {
    this.setPoint(toX, toY, this.getPoint(fromX, fromY));
    this.setPoint(fromX, fromY, undefined);
  }

  drawRockLinesFromInputs(lines: string[]) {
    for (const line of lines) {
      const points = line
        .split(" -> ")
        .map((part) => part.split(","))
        .map(([x, y]) => ({ x: parseInt(x), y: parseInt(y) }));

      this.drawRockLine(points);
      let previous = points.shift()!;

      for (const point of points) {
        // Create a line from the previous to the current
        if (point.x !== previous.x) {
          for (
            let x = Math.min(previous.x, point.x);
            x <= Math.max(previous.x, point.x);
            x++
          ) {
            this.points[point.y][x] = new Rock(x, point.y, this);
          }
        } else if (point.y !== previous.y) {
          for (
            let y = Math.min(previous.y, point.y);
            y <= Math.max(previous.y, point.y);
            y++
          ) {
            this.points[y][point.x] = new Rock(point.x, y, this);
          }
        }

        previous = point;
      }
    }
  }

  drawRockLine(points: Position[]) {
    let previous: Position | undefined = undefined;

    for (const point of points) {
      if (previous) {
        // Create a line from the previous to the current
        if (point.x !== previous.x) {
          const [minX, maxX] = [point.x, previous.x].sort();
          for (let x = minX; x <= maxX; x++) {
            this.setPoint(x, point.y, new Rock(x, point.y, this));
          }
        } else if (point.y !== previous.y) {
          const [minY, maxY] = [point.y, previous.y].sort();
          for (let y = minY; y <= maxY; y++) {
            this.setPoint(point.x, y, new Rock(point.x, y, this));
          }
        }
      }

      previous = point;
    }
  }

  debugPrint(maxY: number) {
    const actualMaxX = Math.max(...this.points.map((row) => row.length));
    const actualMinX = Math.min(
      ...this.points.flatMap(
        (row) => row.map((point) => point?.x).filter(Boolean) as number[]
      )
    );
    console.log("\n\n");
    for (let y = 0; y < this.points.length; y++) {
      let line = "";
      if (y === maxY) {
        line = "#".repeat(actualMaxX - actualMinX + 1);
      } else {
        for (let x = actualMinX; x <= actualMaxX; x++) {
          const point = this.getPoint(x, y);
          line +=
            point instanceof Rock ? "#" : point instanceof Sand ? "o" : ".";
        }
      }
      console.log(line);
    }
  }
}
