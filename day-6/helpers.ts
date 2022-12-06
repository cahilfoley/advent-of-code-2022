export const findIndexOfUniqueString = (input: string, length: number) => {
  const lastCharacters: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const character = input[i];

    if (lastCharacters.length === length) {
      lastCharacters.shift();
    }

    lastCharacters.push(character);

    if (lastCharacters.length === length) {
      if (new Set(lastCharacters).size === length) {
        return i;
      }
    }
  }

  return -1;
};
