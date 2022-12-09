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
    // If it's within 1 space in any direction then do nothing
    if (
      this.x >= target.x - 1 &&
      this.x <= target.x + 1 &&
      this.y >= target.y - 1 &&
      this.y <= target.y + 1
    )
      return;

    // Move a step towards the target
    if (target.x > this.x) this.move(Direction.R);
    if (target.x < this.x) this.move(Direction.L);
    if (target.y > this.y) this.move(Direction.U);
    if (target.y < this.y) this.move(Direction.D);
  }
}
