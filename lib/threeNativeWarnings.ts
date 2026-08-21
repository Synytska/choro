const ignoredThreeNativeMessages = [
  "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.",
  "EXGL: gl.pixelStorei() doesn't support this parameter yet!",
  "THREE.WebGLRenderer: EXT_color_buffer_float extension not supported.",
];

let areThreeNativeWarningsIgnored = false;

const shouldIgnoreMessage = (message: unknown) =>
  typeof message === "string" &&
  ignoredThreeNativeMessages.some((ignoredMessage) => message.includes(ignoredMessage));

export const ignoreThreeNativeWarnings = () => {
  if (!__DEV__ || areThreeNativeWarningsIgnored) return;

  areThreeNativeWarningsIgnored = true;

  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;

  console.log = (...args) => {
    if (shouldIgnoreMessage(args[0])) return;

    originalConsoleLog(...args);
  };

  console.warn = (...args) => {
    if (shouldIgnoreMessage(args[0])) return;

    originalConsoleWarn(...args);
  };
};

ignoreThreeNativeWarnings();
