type LogPayload = unknown;

const shouldLog = typeof __DEV__ !== "undefined" && __DEV__;

export const logger = {
  debug: (message: string, payload?: LogPayload) => {
    if (!shouldLog) return;

    if (payload === undefined) {
      console.debug("DEBUG", message);
      return;
    }

    console.debug(message, payload);
  },
  error: (message: string, payload?: LogPayload) => {
    if (!shouldLog) return;

    if (payload === undefined) {
      console.error("ERROR", message);
      return;
    }

    console.error(message, payload);
  },
};
