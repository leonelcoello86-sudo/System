/** @description Expresión regular que valida contraseñas con minúscula, mayúscula, dígito y carácter especial. */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

/**
 * Valida que una contraseña cumpla con la política de seguridad del sistema.
 * Requiere mínimo 8 caracteres, al menos una minúscula, una mayúscula, un número y un carácter especial.
 * @param {string} password - Contraseña a validar.
 * @returns {{ valid: boolean, message: string }} Resultado de la validación.
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Contraseña requerida' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una minúscula' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una mayúscula' };
  }

  if (!/\d/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un número' };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...)' };
  }

  return { valid: true };
}
