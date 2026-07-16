import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false // Esto es necesario para Render
  }
});

pool.connect()
  .then(() => console.log('Conectado a PostgreSQL en Render exitosamente'))
  .catch(err => console.error('Error de conexión:', err));

export default pool;