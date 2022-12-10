import { readFile } from "fs/promises";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const lines = inputs.split(/\r?\n/g);

  let cycle = 0;
  let x = 1;

  const totals: number[] = [];

  function tick() {
    cycle++;
    console.log(`Cycle ${cycle}: x = ${x}`);
    if ((cycle - 20) % 40 === 0 && cycle <= 220) {
      totals.push(cycle * x);
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
      x += amount;
    }
  }

  console.log(totals);
  console.log(totals.reduce((total, x) => total + x, 0));
}

run();
