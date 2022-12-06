import { readFile } from "fs/promises";

async function run() {
  const content = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );
  const elves = content.split(/\r\n\r\n/gi);

  let max = 0;
  for (const elf of elves) {
    const lines = elf.split(/\r\n/gi);
    const total = lines.reduce((total, item) => total + Number(item), 0);

    if (total > max) {
      max = total;
    }
  }

  console.log(max);
}

run();
