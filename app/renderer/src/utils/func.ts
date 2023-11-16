export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const translateEnumToObjects = (enumObj: any): { label: string; key: string }[] => {
  return Object.keys(enumObj)
    .filter(key => isNaN(Number(key))) // Filter out reverse mappings
    .map(key => ({ label: enumObj[key], key }));
};

export const translateMapToObject = (map: any): { key: string; label: any }[] => {
  return Object.entries(map).map(([key, label]) => ({ key, label }));
};
