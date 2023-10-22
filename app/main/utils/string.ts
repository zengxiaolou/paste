/**
 * Escapes spaces in a file path with backslashes.
 * @param {string} filePath
 * @returns {string} The escaped file path.
 */
export const escapePath = (filePath: string): string => {
  if (filePath.includes(' ')) {
    return filePath.split(' ').join('\\ ');
  }
  return filePath;
};
