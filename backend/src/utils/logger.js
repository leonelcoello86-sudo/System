export function formatTimestamp() {
  return new Date().toISOString();
}

export function logInfo(message) {
  console.log(`[INFO] [${formatTimestamp()}] ${message}`);
}

export function logWarning(message) {
  console.warn(`[WARN] [${formatTimestamp()}] ${message}`);
}

export function logError(message) {
  console.error(`[ERROR] [${formatTimestamp()}] ${message}`);
}
