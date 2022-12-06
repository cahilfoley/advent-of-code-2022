export const getPriorityForItem = (character: string): number => {
  const charCode = character.charCodeAt(0);

  // Capital letters start from unicode character 65 but start scoring at 27
  if (charCode < 97) return charCode - 65 + 27;

  // Lower case letters start from unicode 97 but start scoring at 1
  return charCode - 97 + 1;
};
