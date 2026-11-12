# API REST de Usuarios — Node.js + Express + PostgreSQL

API REST que gestiona usuarios (registro, consulta, actualización y eliminación) y guarda los datos en una base de datos PostgreSQL. Trabajo Práctico Experimental 3 de Desarrollo Web.

## Tecnologías utilizadas

- **Node.js**: entorno de ejecución de JavaScript
- **Express 5**: framework para la API REST
- **PostgreSQL**: base de datos relacional
- **pg (node-postgres)**: conexión entre Node.js y PostgreSQL con un pool y consultas parametrizadas
- **bcryptjs**: cifrado de contraseñas
- **dotenv**: variables de entorno
- **cors**: permite peticiones desde otros orígenes
- **Postman**: pruebas de los endpoints

## Funcionalidades implementadas

- CRUD completo de usuarios
- Validación de los datos JSON (campos obligatorios, formato de email, longitud, teléfono)
- Contraseñas cifradas con bcrypt, que nunca se devuelven en las respuestas
- Email único (si se repite, la API responde `409 Conflict`)
- Actualización parcial: en `PUT` solo se modifican los campos enviados
- Códigos HTTP adecuados y mensajes de error claros en JSON
- Script que crea automáticamente la base de datos y la tabla

## Endpoints

| Método | Ruta            | Descripción        | Respuesta exitosa |
|--------|-----------------|--------------------|-------------------|
| POST   | `/usuarios`     | Registrar usuario  | `201 Created`     |
| GET    | `/usuarios`     | Consultar todos    | `200 OK`          |
| GET    | `/usuarios/:id` | Consultar por ID   | `200 OK`          |
| PUT    | `/usuarios/:id` | Actualizar usuario | `200 OK`          |
| DELETE | `/usuarios/:id` | Eliminar usuario   | `200 OK`          |

**Errores:** `400` datos inválidos o JSON mal formado · `404` usuario o ruta no encontrada · `409` email duplicado · `500` error interno.

### Ejemplo de body (POST)

```json
{
  "nombre": "María",
  "apellido": "Gómez",
  "email": "maria.gomez@correo.com",
  "password": "secreto123",
  "telefono": "0991112233"
}
```

## Estructura del proyecto

```
├── database/
│   └── schema.sql                 # Tabla usuarios + datos de ejemplo
├── postman/
│   └── API_Usuarios.postman_collection.json
├── scripts/
│   └── initDb.js                  # Crea la BD y ejecuta schema.sql
├── src/
│   ├── config/db.js               # Conexión (Pool) a PostgreSQL
│   ├── controllers/usuarios.controller.js
│   ├── middlewares/
│   │   ├── validarUsuario.js      # Validación de id y body
│   │   └── errorHandler.js        # 404 y manejo central de errores
│   ├── routes/usuarios.routes.js
│   ├── app.js                     # Configuración de Express
│   └── server.js                  # Punto de entrada
├── .env.example
└── package.json
```

## Instalación y ejecución

1. Clonar el repositorio e instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar `.env.example` como `.env` y poner la contraseña de PostgreSQL:
   ```bash
   cp .env.example .env
   ```
3. Crear la base de datos y la tabla:
   ```bash
   npm run db:init
   ```
   (También puedes ejecutar `database/schema.sql` manualmente en pgAdmin.)
4. Iniciar el servidor:
   ```bash
   npm run dev
   ```
   La API queda disponible en `http://localhost:3000`.

## Pruebas con Postman

Importa `postman/API_Usuarios.postman_collection.json` en Postman (**Import → File**). La colección trae las peticiones del CRUD y los casos de error (datos inválidos, email duplicado, id inexistente). La variable `baseUrl` vale `http://localhost:3000` y `usuarioId` se rellena sola al registrar un usuario.
