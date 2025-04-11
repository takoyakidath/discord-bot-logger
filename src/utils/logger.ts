type LogLevel = "error" | "warn" | "info";

const getLogLevel = (): LogLevel => {
  const level = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
  if (level && ["error", "warn", "info"].includes(level)) {
    return level;
  }
  return "info"; // Default is info
};

const shouldLog = (messageLevel: LogLevel): boolean => {
  const currentLevel = getLogLevel();
  const levels: LogLevel[] = ["error", "warn", "info"];
  return levels.indexOf(messageLevel) <= levels.indexOf(currentLevel);
};

const logger = {
  info: (id: string, message: string) => {
    if (shouldLog("info")) {
      console.log(`[${id}] INFO: ${message}`);
    }
  },
  error: (id: string, message: string) => {
    if (shouldLog("error")) {
      console.error(`[${id}] ERROR: ${message}`);
    }
  },
  warn: (id: string, message: string) => {
    if (shouldLog("warn")) {
      console.warn(`[${id}] WARN: ${message}`);
    }
  },
};

export default logger;
