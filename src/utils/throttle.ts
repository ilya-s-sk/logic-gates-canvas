export const throttle = (func: (...args: unknown[]) => void, ms: number) => {
  let timer: NodeJS.Timeout | null = null;

  return (...args: unknown[]) => {
    if (timer) {
      return;
    }
    func(...args);
    timer = setTimeout(() => {
      timer && clearTimeout(timer);
      timer = null;
    }, ms)
  }
}