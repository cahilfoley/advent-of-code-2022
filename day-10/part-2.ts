import { readFile } from "fs/promises";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);

  let cycle = 0;
  let sprite = 1;

  const display: string[][] = Array.from({ length: 6 }).map(() => []);

  function tick() {
    cycle++;

    const row = Math.floor(((cycle - 1) / 40) % 6);
    const column = (cycle - 1) % 40;

    // If the sprite is within a column either side then draw a block
    if (sprite >= column - 1 && sprite <= column + 1) {
      display[row].push("█");
    } else {
      display[row].push(" ");
    }
  }

  for (const line of lines) {
    const [operation, amountStr] = line.split(" ");

    if (operation === "noop") {
      tick();
    }

    if (operation === "addx") {
      const amount = parseInt(amountStr);
      tick();
      tick();
      sprite += amount;
    }
  }

  for (const row of display) {
    console.log(row.join(""));
  }
}

run();
