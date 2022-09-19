import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 8);

export function shortId() {
  return nanoid();
}
