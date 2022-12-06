import { readFile } from "fs/promises";
import {
  calculateRoundScore,
  ElfMoveCode,
  elfMoves,
  positionResults,
  Result,
  Shape,
  shapeOrder,
} from "./helpers.js";

type ResultCode = "X" | "Y" | "Z";

const resultCodes: Record<ResultCode, Result> = {
  X: Result.Lose,
  Y: Result.Draw,
  Z: Result.Win,
};

export const getMoveForResult = (elfMove: Shape, result: Result): Shape => {
  const elfMoveIndex = shapeOrder.indexOf(elfMove);
  const desiredResult = positionResults.indexOf(result);

  return shapeOrder[(3 + elfMoveIndex - desiredResult) % 3];
};

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );
  const rounds = inputs.split(/\r?\n/g);

  let total = 0;

  for (const round of rounds) {
    const [elfMoveCode, resultCode] = round.split(" ");
    const elfMove = elfMoves[elfMoveCode as ElfMoveCode];
    const desiredResult = resultCodes[resultCode as ResultCode];

    const responseMove = getMoveForResult(elfMove, desiredResult);
    const score = calculateRoundScore(elfMove, responseMove);
    total += score;
  }

  console.log(total);
}

run();
