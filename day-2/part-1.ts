import { readFile } from "fs/promises";
import {
  calculateRoundScore,
  ElfMoveCode,
  elfMoves,
  Shape,
} from "./helpers.js";

export type ResponseMoveCode = "X" | "Y" | "Z";

export const responseMoves: Record<ResponseMoveCode, Shape> = {
  X: Shape.Rock,
  Y: Shape.Paper,
  Z: Shape.Scissors,
};

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );
  const rounds = inputs.split(/\r?\n/g);

  let total = 0;

  for (const round of rounds) {
    const [elfMoveCode, responseMoveCode] = round.split(" ");
    const elfMove = elfMoves[elfMoveCode as ElfMoveCode];
    const responseMove = responseMoves[responseMoveCode as ResponseMoveCode];

    const score = calculateRoundScore(elfMove, responseMove);
    total += score;
  }

  console.log(total);
}

run();
