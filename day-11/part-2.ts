import { readFile } from "fs/promises";

type Operator = "*" | "+" | "-" | "/";
type Value = `${number | "old"}`;

export class Monkey {
  inspected = 0;
  static worryModulus = 1;

  static monkeys: Monkey[] = [];

  static calculateCommonModulus() {
    let mod = Math.max(...this.monkeys.map((monkey) => monkey.divisibleCheck));

    const increment = mod;
    while (mod < Number.MAX_SAFE_INTEGER) {
      const allDivisible = this.monkeys.every(
        (monkey) => mod % monkey.divisibleCheck === 0
      );
      if (allDivisible) break;
      mod += increment;
    }

    this.worryModulus = mod;
  }

  static fromInputs(inputs: string): Monkey[] {
    const monkeyInputs = inputs.split(/\r?\n\r?\n/g);

    for (const monkeyInput of monkeyInputs) {
      const lines = monkeyInput.split(/\r?\n/g);
      const monkeyIndex = parseInt(lines[0].split(" ")[1].replace(":", ""));
      const items = lines[1]
        .split(": ")[1]
        .split(", ")
        .map((item) => parseInt(item));
      const { operator, value } =
        /new = old (?<operator>.) (?<value>.+)/i.exec(lines[2])?.groups ?? {};
      const divisibleCheck = parseInt(lines[3].split(" ").pop() ?? "");
      const trueTarget = parseInt(lines[4].split(" ").pop() ?? "");
      const falseTarget = parseInt(lines[5].split(" ").pop() ?? "");

      const monkey = new Monkey(
        items,
        divisibleCheck,
        operator as Operator,
        value as Value,
        trueTarget,
        falseTarget
      );

      this.monkeys[monkeyIndex] = monkey;
    }

    this.calculateCommonModulus();

    return this.monkeys;
  }

  constructor(
    public items: number[],
    public divisibleCheck: number,
    public operator: Operator,
    public value: Value,
    public trueTarget: number,
    public falseTarget: number
  ) {}

  scaleWorry(worry: number): number {
    const value = parseInt(this.value.replace("old", `${worry}`));
    if (this.operator === "*") return worry * value;
    if (this.operator === "/") return worry / value;
    if (this.operator === "-") return worry - value;
    if (this.operator === "+") return worry + value;
    throw new Error(`Unknown operator ${this.operator}`);
  }

  processItems() {
    for (const item of this.items) {
      this.inspected++;

      const resultItem = this.scaleWorry(item) % Monkey.worryModulus;

      const targetMonkey =
        resultItem % this.divisibleCheck === 0
          ? this.trueTarget
          : this.falseTarget;

      Monkey.monkeys[targetMonkey].items.push(resultItem);
    }

    // All items have been thrown
    this.items = [];
  }
}

async function run() {
  const inputs = await readFile(
    new URL("./inputs.txt", import.meta.url),
    "utf8"
  );

  const monkeys = Monkey.fromInputs(inputs);

  for (let round = 0; round < 10000; round++) {
    for (const monkey of monkeys) {
      monkey.processItems();
    }
  }

  const totals = monkeys
    .map((monkey) => monkey.inspected)
    .sort((a, z) => a - z);

  const tops = (totals.pop() ?? 0) * (totals.pop() ?? 0);
  console.log(tops);
}

run();
