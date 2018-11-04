export function reduceToType<T>(type: { new (): T }, source: object): T {
  const destination = new type();
  Object.keys(type).forEach((key) => (destination[key] = source[key]));
  return destination;
}
