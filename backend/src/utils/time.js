/**
 * Retorna la hora actual en formato de 24 horas (HH:MM:SS) usando la zona horaria de Venezuela.
 * @returns {string} Hora en formato "HH:MM:SS".
 */
export function nowTimeString() {
  return new Date().toLocaleTimeString('es-VE', { hour12: false });
}
