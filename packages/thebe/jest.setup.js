import crypto from 'crypto';
import { TextEncoder, TextDecoder } from 'util';

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.console.debug = () => {};
