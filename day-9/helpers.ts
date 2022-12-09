export enum Direction {
  R = "R",
  U = "U",
  L = "L",
  D = "D",
}

export class Point {
  constructor(public x: number, public y: number) {}

  move(direction: Direction) {
    if (direction === Direction.U) this.y += 1;
    if (direction === Direction.D) this.y -= 1;
    if (direction === Direction.R) this.x += 1;
    if (direction === Direction.L) this.x -= 1;
  }

  follow(target: Point) {
    // If it's touching then do nothing
    if (
      this.x >= target.x - 1 &&
      this.x <= target.x + 1 &&
      this.y >= target.y - 1 &&
      this.y <= target.y + 1
    )
      return;

    // Same column, just move the row
    if (target.x === this.x) {
      if (target.y > this.y + 1) this.y += 1;
      if (target.y < this.y - 1) this.y -= 1;
      return;
    }

    // Same row, just move the column
    if (target.y === this.y) {
      if (target.x > this.x + 1) this.x += 1;
      if (target.x < this.x - 1) this.x -= 1;
      return;
    }

    // X and Y are both different, move diagonally toward the point
    this.x = target.x > this.x ? this.x + 1 : this.x - 1;
    this.y = target.y > this.y ? this.y + 1 : this.y - 1;
  }
}

// export function follow(head: Position, tail: Position): Position {
//   if (head.x === tail.x && head.y === tail.y) return tail;
//   if (
//     tail.x >= head.x - 1 &&
//     tail.x <= head.x + 1 &&
//     tail.y >= head.y - 1 &&
//     tail.y <= head.y + 1
//   )
//     return tail;

//   if (head.x === tail.x) {
//     if (head.y > tail.y + 1) return { ...tail, y: tail.y + 1 };
//     if (head.y < tail.y - 1) return { ...tail, y: tail.y - 1 };
//     return tail;
//   }

//   if (head.y === tail.y) {
//     if (head.x > tail.x + 1) return { ...tail, x: tail.x + 1 };
//     if (head.x < tail.x - 1) return { ...tail, x: tail.x - 1 };
//     return tail;
//   }

//   // X and Y are both different, move diagonally toward the head
//   return {
//     x: head.x > tail.x ? tail.x + 1 : tail.x - 1,
//     y: head.y > tail.y ? tail.y + 1 : tail.y - 1,
//   };
// }

// export function move(position: Position, direction: Direction) {
//   switch (direction) {
//     case Direction.U:
//       position.y += 1;
//       break;
//     case Direction.D:
//       position.y -= 1;
//       break;
//     case Direction.R:
//       position.x += 1;
//     case Direction.L:
//       position.x -= 1;
//   }
// }
