// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom no implementa ResizeObserver; @radix-ui/react-use-size (usado por
// Switch, Select, etc.) lo requiere en su effect de montaje.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

