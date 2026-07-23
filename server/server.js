import express from 'express';
import cors from 'cors';
import { registrarCliente } from './controllers/register.controller.js';
import { loginCliente } from './controllers/login.controller.js';
<<<<<<< HEAD

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

// Apuntar formularios
app.post('/api/register', registrarCliente);
app.post('/api/login', loginCliente);

=======
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales de parsing y CORS
app.use(cors());
app.use(express.json());

// Rutas heredadas / Autenticación existente
app.post('/api/register', registrarCliente);
app.post('/api/login', loginCliente);

// Rutas de módulos organizadas en la arquitectura por capas
app.use('/api', apiRoutes);

// Ruta base de prueba de salud (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Servidor Gestor Store funcionando correctamente'
    });
});

// Middleware centralizado de manejo de errores (debe ser el último middleware)
app.use(errorHandler);

>>>>>>> backend
app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});