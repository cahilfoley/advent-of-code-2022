export class Coordinate {
  value: number;

  constructor(
    public x: number,
    public y: number,
    public grid: Grid,
    public height: string
  ) {
    if (height === "E") {
      this.value = "z".charCodeAt(0);
    } else if (height === "S") {
      this.value = "a".charCodeAt(0);
    } else {
      this.value = height.toLowerCase().charCodeAt(0);
    }
  }

  canMoveToCoordinate(target: Coordinate) {
    return target.value <= this.value + 1;
  }

  getPossibleMoves() {
    const left = this.grid.coordinates[this.y][this.x - 1];
    const right = this.grid.coordinates[this.y][this.x + 1];
    const up = this.grid.coordinates[this.y - 1]?.[this.x];
    const down = this.grid.coordinates[this.y + 1]?.[this.x];

    return [left, right, up, down].filter(
      (target) => target && this.canMoveToCoordinate(target)
    );
  }

  getDistanceTo(target: Coordinate) {
    const d1 = Math.abs(target.x - this.x);
    const d2 = Math.abs(target.y - this.y);
    return d1 + d2;
  }
}

export class AStarResult {
  startNode: AStarCoordinate;
  path: AStarCoordinate[] = [];

  get length() {
    return this.path.length;
  }

  constructor(
    public grid: AStarCoordinate[][],
    public endNode: AStarCoordinate
  ) {
    let current = endNode;

    while (current.parent) {
      this.path.unshift(current);
      current = current.parent;
    }

    this.startNode = this.path[0].parent!;
  }

  printPath() {
    for (let y = 0; y < this.grid.length; y++) {
      console.log(
        this.grid[y]
          .map((position) => {
            if (position === this.startNode) return "S";
            if (position === this.endNode) return "E";

            const resultIndex = this.path.indexOf(position);
            if (resultIndex === -1) return ".";

            const nextMove = this.path[resultIndex + 1];
            if (nextMove) {
              if (nextMove.coordinate.y > position.coordinate.y) return "v";
              if (nextMove.coordinate.y < position.coordinate.y) return "^";
              if (nextMove.coordinate.x > position.coordinate.x) return ">";
              if (nextMove.coordinate.x < position.coordinate.x) return "<";
            }
            return ".";
          })
          .join("")
      );
    }
  }
}

export class AStarCoordinate {
  parent?: AStarCoordinate;
  g?: number;
  h?: number;

  constructor(public coordinate: Coordinate, public f = 0) {}
}

export class Grid {
  from?: Coordinate;
  to?: Coordinate;
  coordinates: Coordinate[][] = [];

  findAStarPath(from: Coordinate, to: Coordinate) {
    const searchGrid = this.coordinates.map((row) =>
      row.map((coordinate) => new AStarCoordinate(coordinate))
    );

    const start = searchGrid[from.y][from.x];
    const target = searchGrid[to.y][to.x];
    const openList = [start];
    const closedList: AStarCoordinate[] = [];

    while (openList.length) {
      let lowestIndex = 0;
      for (let i = 0; i < openList.length; i++) {
        if (openList[i].f < openList[lowestIndex].f) {
          lowestIndex = i;
        }
      }
      const currentNode = openList[lowestIndex];

      if (currentNode === target) {
        return new AStarResult(searchGrid, currentNode);
      }

      // Remove the current from the open list and put it in the closed list
      openList.splice(lowestIndex, 1);
      closedList.push(currentNode);

      const neighbours = currentNode.coordinate
        .getPossibleMoves()
        .map((neighbour) => searchGrid[neighbour.y][neighbour.x]);

      for (const neighbour of neighbours) {
        if (closedList.includes(neighbour)) {
          continue;
        }

        const gScore = (currentNode.g ?? 0) + 1;
        let gScoreIsBest = false;

        if (!openList.includes(neighbour)) {
          // First time we've seen the node
          gScoreIsBest = true;
          neighbour.h = neighbour.coordinate.getDistanceTo(target.coordinate);
          openList.push(neighbour);
        } else if (gScore < neighbour.g!) {
          // Already seen neighbour but found a better route
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          neighbour.parent = currentNode;
          neighbour.g = gScore;
          neighbour.f = neighbour.g! + neighbour.h!;
        }
      }
    }

    // No result found
    return undefined;
  }

  static fromInput(input: string): Grid {
    const grid = new Grid();

    const rows = input.split(/\r?\n/g);

    for (let y = 0; y < rows.length; y++) {
      grid.coordinates[y] = [];
      for (let x = 0; x < rows[y].length; x++) {
        const height = rows[y][x];
        const coordinate = new Coordinate(x, y, grid, height);
        if (height === "E") grid.to = coordinate;
        if (height === "S") grid.from = coordinate;
        grid.coordinates[y][x] = coordinate;
      }
    }

    return grid;
  }
}
