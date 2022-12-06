import { readFile } from "fs/promises";

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );
  const lines = inputs.split(/\r?\n/g);

  let total = 0;

  for (const line of lines) {
    const [elf1, elf2] = line.split(",");
    const [range1Start, range1End] = elf1.split("-");
    const [range2Start, range2End] = elf2.split("-");

    const start1 = +range1Start;
    const start2 = +range2Start;
    const end1 = +range1End;
    const end2 = +range2End;

    if (
      (start1 >= start2 && end1 <= end2) ||
      (start2 >= start1 && end2 <= end1)
    ) {
      total++;
    }
  }

  console.log(total);
}

run();
