// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// react-router-dom@7 references TextEncoder/TextDecoder at import time --
// jsdom (react-scripts 5's default Jest test environment) doesn't define
// them globally, only Node's own `util` module does. Without this, any
// test that imports react-router-dom fails immediately with
// "TextEncoder is not defined", before a single test even runs.
import { TextDecoder, TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  // @ts-expect-error -- TS 5.7+ made Uint8Array generic over its buffer
  // type; Node's TextEncoder.encode() returns Uint8Array<ArrayBufferLike>
  // where the DOM lib's TextEncoder type expects Uint8Array<ArrayBuffer>.
  // Functionally identical at runtime.
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-expect-error -- Node's TextDecoder and the DOM lib's TextDecoder
  // type disagree on a couple of fields; functionally equivalent here.
  global.TextDecoder = TextDecoder;
}
