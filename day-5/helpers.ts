export function parseStackManifest(manifest: string): string[][] {
  const positions = manifest.split(/\r?\n/g);
  const stackNames = positions.pop();
  if (!stackNames) throw new Error("No stack names");

  // Create the empty stacks
  const stacks: string[][] = stackNames
    .trim()
    .split(/\s+/g)
    .map(() => []);

  // Add items to the stacks
  for (const row of positions) {
    for (let i = 1; i < row.length; i += 4) {
      const character = row[i];
      if (character.trim()) {
        stacks[(i - 1) / 4].unshift(character);
      }
    }
  }

  return stacks;
}

interface Move {
  text: string;
  count: number;
  from: number;
  to: number;
}

export function parseMoves(movesText: string): Move[] {
  const moves = movesText.split(/\r?\n/g);

  return moves.map((moveText) => {
    const { count, from, to } =
      /move (?<count>\d+) from (?<from>\d+) to (?<to>\d+)/gi.exec(moveText)
        ?.groups ?? {};

    return { text: moveText, count: +count, from: +from - 1, to: +to - 1 };
  });
}

export function parseInputs(inputs: string) {
  const endOfManifest = inputs.match(/(?:\d\s+)+\r?\n/);
  const endOfManifestIndex =
    (endOfManifest?.index ?? 0) + (endOfManifest?.[0]?.length ?? 0);
  const manifest = inputs.slice(0, endOfManifestIndex).trimEnd();
  const movesText = inputs.slice(endOfManifestIndex);

  return {
    stacks: parseStackManifest(manifest),
    moves: parseMoves(movesText),
  };
}

export function printStackMove(
  move: string,
  stacksBefore: string[][],
  stacksAfter: string[][]
) {
  let output = `\n\n ** Evaluating the move: ${move} **`;
  const tallestStackHeight = Math.max(
    ...stacksBefore.map((stack) => stack.length),
    ...(stacksAfter?.map((stack) => stack.length) ?? [])
  );

  for (let i = tallestStackHeight - 1; i >= 0; i--) {
    output += "\n";
    output += stacksBefore
      .map((stack) => {
        if (i < stack.length) {
          return `[${stack[i]}]`;
        } else {
          return "   ";
        }
      })
      .join(" ");

    if (i === Math.floor(tallestStackHeight / 2)) {
      output += "  >>>  ";
    } else {
      output += "   |   ";
    }

    output += stacksAfter
      .map((stack) => {
        if (i < stack.length) {
          return `[${stack[i]}]`;
        } else {
          return "   ";
        }
      })
      .join(" ");
  }

  output += `\n ${stacksBefore.map((stack, i) => i + 1).join("   ")}`;
  output += "    |    ";
  output += stacksAfter.map((stack, i) => i + 1).join("   ");

  console.log(output);
}
