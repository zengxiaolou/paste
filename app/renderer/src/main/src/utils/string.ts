export const extractMostFrequentBackgroundColor = (content: string): string | undefined => {
  const hexRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

  if (hexRegex.test(content)) {
    return content;
  }

  const bgColorRegex = /background-color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3});/g;
  let match;
  const colorCounts: { [color: string]: number } = {};

  while ((match = bgColorRegex.exec(content)) !== null) {
    const color = match[1];
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  }

  let mostFrequentColor;
  let maxCount = 0;

  for (const color in colorCounts) {
    if (colorCounts[color] > maxCount) {
      maxCount = colorCounts[color];
      mostFrequentColor = color;
    }
  }

  return mostFrequentColor;
};
