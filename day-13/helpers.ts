export type Message = number | (number | Message)[];

const DEBUG_LOGGING = false;

function ensureArray(message: Message): Message[] {
  if (typeof message === "number") return [message];
  return message;
}

export function compareMessages(a: Message, b: Message, depth = 0): number {
  if (DEBUG_LOGGING) {
    console.log(
      `${"  ".repeat(depth)}Comparing ${JSON.stringify(a)} and ${JSON.stringify(
        b
      )}`
    );
  }

  if (typeof a === "number" && typeof b === "number") return a - b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length === 0 && b.length === 0) return 0;

    const longest = Math.max(a.length, b.length);

    for (let i = 0; i < longest; i++) {
      if (i > a.length - 1) return -1;
      if (i > b.length - 1) return 1;
      if (a[i] !== b[i]) {
        const result = compareMessages(a[i], b[i], depth + 1);
        if (result !== 0) {
          return result;
        }
      }
    }

    return 0;
  }

  return compareMessages(ensureArray(a), ensureArray(b), depth + 1);
}
