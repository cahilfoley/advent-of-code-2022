import { readFile } from "fs/promises";

function isTreeVisible(grid: number[][], treeX: number, treeY: number) {
  // Edge trees are always visible
  if (treeX === 0 || treeX === grid[treeY].length - 1) return true;
  if (treeY === 0 || treeY === grid.length - 1) return true;

  const height = grid[treeY][treeX];

  // Visible from left
  for (let x = 0; x <= treeX; x++) {
    if (x === treeX) return true;
    if (grid[treeY][x] >= height) break;
  }

  // Visible from right
  for (let x = grid[treeY].length - 1; x >= treeX; x--) {
    if (x === treeX) return true;
    if (grid[treeY][x] >= height) break;
  }

  // Visible from top
  for (let y = 0; y <= treeY; y++) {
    if (y === treeY) return true;
    if (grid[y][treeX] >= height) break;
  }

  // Visible from top
  for (let y = grid.length - 1; y >= treeY; y--) {
    if (y === treeY) return true;
    if (grid[y][treeX] >= height) break;
  }
}

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const trees = inputs
    .split(/\r?\n/g)
    .map((line) => Array.from(line).map((char) => Number(char)));

  const totalVisible = trees.flatMap((row, y) =>
    row.filter((tree, x) => isTreeVisible(trees, x, y))
  ).length;

  console.log(totalVisible);
}

run();
