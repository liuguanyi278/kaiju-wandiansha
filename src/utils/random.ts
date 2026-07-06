export function randomItem<T>(items: T[], previous?: T): T {
  if (items.length === 0) {
    throw new Error('Cannot pick a random item from an empty array.');
  }

  if (items.length === 1) {
    return items[0];
  }

  let next = items[Math.floor(Math.random() * items.length)];
  while (next === previous) {
    next = items[Math.floor(Math.random() * items.length)];
  }

  return next;
}
