import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'node:util';

// react-router v7 expects these globals, which jsdom doesn't provide.
Object.assign(globalThis, { TextEncoder, TextDecoder });
