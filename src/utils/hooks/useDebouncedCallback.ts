export const useDebouncedCallback = <TFunction extends (...args: any[]) => any>(
  effect: TFunction,
  delay = 200
): ((...args: Parameters<TFunction>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<TFunction>) => {
    if (typeof timeout === 'number') {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(() => effect(...args), delay);
  };
};
