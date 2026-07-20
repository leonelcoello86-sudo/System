/**
 * Longitudes máximas permitidas para cada campo de entrada.
 */
export const MAX_LENGTHS = {
  email: 254,
  name: 100,
  status: 50,
  type: 50,
  icon: 20
};

/**
 * Expresión regular para validar formato de email (RFC 5322 simplificado).
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Valida que un email tenga formato válido y longitud permitida.
 * @param {string} email - Email a validar.
 * @returns {{ valid: boolean, message: string }} Resultado de la validación.
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email requerido' };
  }

  const trimmed = email.trim();

  if (trimmed.length > MAX_LENGTHS.email) {
    return { valid: false, message: `Email no puede exceder ${MAX_LENGTHS.email} caracteres` };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: 'Formato de email inválido' };
  }

  return { valid: true };
}

/**
 * Valida que un string no exceda la longitud máxima permitida.
 * @param {string} value - Valor a validar.
 * @param {string} fieldName - Nombre del campo (para el mensaje de error).
 * @param {number} maxLength - Longitud máxima permitida.
 * @returns {{ valid: boolean, message: string }} Resultado de la validación.
 */
export function validateMaxLength(value, fieldName, maxLength) {
  if (value === undefined || value === null) {
    return { valid: true };
  }

  const str = String(value).trim();
  if (str.length > maxLength) {
    return { valid: false, message: `${fieldName} no puede exceder ${maxLength} caracteres` };
  }

  return { valid: true };
}

/**
 * Sanitiza un string eliminando caracteres peligrosos y normalizando espacios.
 * @param {string} value - Valor a sanitizar.
 * @returns {string} Valor sanitizado.
 */
export function sanitizeString(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .trim()
    .replace(/[<>'"]/g, '')
    .replace(/\s+/g, ' ');
}
