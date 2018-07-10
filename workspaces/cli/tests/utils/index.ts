const stdin = require('bdd-stdin');

export const ENTER = '\x0D';

export async function runWithAnswers<A>(
  command: () => Promise<A>,
  combo: Array<string> = []
): Promise<A> {
  if (combo.length > 0) stdin(combo);
  return command();
}
