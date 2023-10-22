import fs from 'node:fs/promises';

export const deleteFile = async (path: string) => {
  try {
    await fs.unlink(path);
  } catch (error: unknown) {
    console.error('Error deleting file:', error);
  }
};
