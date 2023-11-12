export const extractOutermostBackgroundColor = (content: string): string | undefined => {
  const hexRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
  const rgbRegex = /^rgb\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*\)$/;
  const rgbaRegex = /^rgba\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\s*\)$/;

  if (hexRegex.test(content)) {
    return content;
  }

  if (rgbRegex.test(content)) {
    return content;
  }

  if (rgbaRegex.test(content)) {
    return content;
  }

  const bgColorRegex =
    /background-color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(0|1|0?\.\d+)\s*\));/;
  const match = bgColorRegex.exec(content);

  if (match) {
    return match[1];
  }

  return undefined;
};

export const parseShortcut = (shortcut: string): Record<string, boolean | string | undefined> => {
  const parts = shortcut.toLowerCase().split('+');
  return {
    ctrl: parts.includes('ctrl'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    meta: parts.includes('command'),
    key: parts.find(part => !['ctrl', 'alt', 'shift', 'command'].includes(part)),
  };
};
