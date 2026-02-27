const ERROR_MESSAGES = {
  'Invalid login credentials': 'Correo o contraseña incorrectos',
  'Email not confirmed': 'Revisa tu correo para confirmar tu cuenta',
  'User already registered': 'Este correo ya está registrado',
  'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'Email rate limit exceeded': 'Demasiados intentos. Espera unos minutos.',
  'Invalid email': 'Correo electrónico inválido',
  'Signup requires a valid password': 'Ingresa una contraseña válida',
  'Token has expired or is invalid': 'El enlace expiró. Solicita uno nuevo.',
  'New password should be different from the old password': 'La nueva contraseña debe ser diferente',
  'For security purposes, you can only request this once every 60 seconds': 'Por seguridad, espera 60 segundos antes de intentar de nuevo',
}

export function translateError(error) {
  if (!error) return 'Error desconocido'
  const message = error.message || error.error_description || String(error)
  return ERROR_MESSAGES[message] || message
}
