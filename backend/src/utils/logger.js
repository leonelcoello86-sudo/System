/**
 * Retorna la marca de tiempo actual en formato ISO 8601.
 * @returns {string} Fecha/hora en formato ISO (ej. "2026-07-18T12:00:00.000Z").
 */
export function formatTimestamp() {
  return new Date().toISOString();
}

/**
 * Registra un mensaje de nivel informativo en consola (formato legible por humanos).
 * @param {string} message - Mensaje a registrar.
 */
export function logInfo(message) {
  console.log(`[INFO] [${formatTimestamp()}] ${message}`);
}

/**
 * Registra un mensaje de advertencia en consola (formato legible por humanos).
 * @param {string} message - Mensaje a registrar.
 */
export function logWarning(message) {
  console.warn(`[WARN] [${formatTimestamp()}] ${message}`);
}

/**
 * Registra un mensaje de error en consola (formato legible por humanos).
 * @param {string} message - Mensaje de error a registrar.
 */
export function logError(message) {
  console.error(`[ERROR] [${formatTimestamp()}] ${message}`);
}

/**
 * Registra un evento en formato JSON estructurado, legible por máquinas.
 * @param {string} level - Nivel del evento (info, warn, error).
 * @param {string} message - Descripción del evento.
 * @param {object} [meta={}] - Metadatos adicionales (correlationId, userId, etc.).
 */
export function logJson(level, message, meta = {}) {
  const entry = {
    timestamp: formatTimestamp(),
    level,
    message,
    ...meta
  };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}
