require('dotenv').config({ quiet: true });

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    // Verifica la conexión con PostgreSQL antes de levantar el servidor
    await pool.query('SELECT 1');
    console.log('✔ Conectado a PostgreSQL');

    app.listen(PORT, () => {
      console.log(`✔ Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✖ No se pudo conectar a PostgreSQL:', err.message);
    console.error('  Revisa las variables del archivo .env y ejecuta "npm run db:init".');
    process.exit(1);
  }
}

iniciar();
