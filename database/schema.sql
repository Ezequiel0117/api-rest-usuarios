-- Base de datos: api_usuarios
-- Si la creas manualmente (pgAdmin / psql):
--   CREATE DATABASE api_usuarios;
--   \c api_usuarios

CREATE TABLE IF NOT EXISTS usuarios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(50)  NOT NULL,
  apellido       VARCHAR(50)  NOT NULL,
  email          VARCHAR(100) NOT NULL UNIQUE,
  password       VARCHAR(100) NOT NULL,          -- se guarda cifrada con bcrypt
  telefono       VARCHAR(15),
  creado_en      TIMESTAMP    NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Datos de ejemplo (contraseña de ambos: 123456)
INSERT INTO usuarios (nombre, apellido, email, password, telefono) VALUES
  ('Ana',  'Torres', 'ana.torres@correo.com',  '$2b$10$l1zoOQlcd0FlgfYnHhy/lea735tNPUojiNEfZARNCXK7xcx1sPKs.', '0991234567'),
  ('Luis', 'Pérez',  'luis.perez@correo.com',  '$2b$10$l1zoOQlcd0FlgfYnHhy/lea735tNPUojiNEfZARNCXK7xcx1sPKs.', '0987654321')
ON CONFLICT (email) DO NOTHING;
