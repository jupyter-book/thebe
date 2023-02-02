import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 8);

/**
 * Creates a compact random id for use in runtime objects
 *
 * @returns string
 */
export function shortId() {
  return nanoid();
}

export function ensureString(maybeString: string[] | string): string {
  if (Array.isArray(maybeString)) return maybeString.join('\n');
  return maybeString;
}
