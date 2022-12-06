export enum Shape {
  Rock = "Rock",
  Paper = "Paper",
  Scissors = "Scissors",
}

export type ElfMoveCode = "A" | "B" | "C";

export const elfMoves: Record<ElfMoveCode, Shape> = {
  A: Shape.Rock,
  B: Shape.Paper,
  C: Shape.Scissors,
};

export const shapeScores = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

export enum Result {
  Lose = "Lose",
  Draw = "Draw",
  Win = "Win",
}

export const resultScores: Record<Result, number> = {
  [Result.Lose]: 0,
  [Result.Draw]: 3,
  [Result.Win]: 6,
};

// Each one beats the next one, wrapping at the end
export const shapeOrder = [Shape.Scissors, Shape.Paper, Shape.Rock];

/**
 * If you take the indexes of the shapes in the above and calculate
 *
 *   (3 + elfMoveIndex - responseMoveIndex) mod 3
 *
 * then the resulting index in this array will give you the result.
 */
export const positionResults = [Result.Draw, Result.Win, Result.Lose];

export const calculateRoundResult = (
  elfMove: Shape,
  responseMove: Shape
): Result => {
  const elfMoveIndex = shapeOrder.indexOf(elfMove);
  const responseMoveIndex = shapeOrder.indexOf(responseMove);

  const result = (3 + elfMoveIndex - responseMoveIndex) % 3;

  return positionResults[result];
};

export const calculateRoundScore = (
  elfMove: Shape,
  responseMove: Shape
): number => {
  const result = calculateRoundResult(elfMove, responseMove);
  return resultScores[result] + shapeScores[responseMove];
};
