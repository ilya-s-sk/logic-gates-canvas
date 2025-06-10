
const createRData = (
  data: Record<string, unknown>,
  handler: (...args: unknown[]) => void,
) => {
  return new Proxy(data, {
    set(target, p, newValue, receiver) {
      handler(p, newValue);

      return true;
    },
  })
}