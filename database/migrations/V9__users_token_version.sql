-- BRINDA · V9 · Invalidación de sesiones: el JWT lleva la versión del usuario y deja de valer si cambia.
-- Se incrementa al cerrar sesión y al cambiar la contraseña.
ALTER TABLE users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0;
