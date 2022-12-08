import { readFile } from "fs/promises";

function getScenicScoreForTree(
  trees: number[][],
  treeX: number,
  treeY: number
): number {
  const totals = {
    left: 0,
    right: 0,
    up: 0,
    down: 0,
  };
  const height = trees[treeY][treeX];

  // Visible to the left
  for (let x = treeX - 1; x >= 0; x--) {
    totals.left++;
    if (trees[treeY][x] >= height) break;
  }
  // Visible to the right
  for (let x = treeX + 1; x < trees[treeY].length; x++) {
    totals.right++;
    if (trees[treeY][x] >= height) break;
  }

  // Visible to the top
  for (let y = treeY - 1; y >= 0; y--) {
    totals.up++;
    if (trees[y][treeX] >= height) break;
  }
  // Visible to the right
  for (let y = treeY + 1; y < trees.length; y++) {
    totals.down++;
    if (trees[y][treeX] >= height) break;
  }

  return totals.left * totals.right * totals.up * totals.down;
}

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const trees: number[][] = [];

  const lines = inputs.split(/\r?\n/g);

  for (const line of lines) {
    trees.push(Array.from(line).map((char) => Number(char)));
  }

  const scenicScores = trees.flatMap((row, y) =>
    row.flatMap((col, x) => getScenicScoreForTree(trees, x, y))
  );

  console.log(Math.max(...scenicScores));
}

run();
