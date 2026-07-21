import express from 'express';
import cors from 'cors';
import { registrarCliente } from './controllers/register.controller.js';
import { loginCliente } from './controllers/login.controller.js';

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

// Apuntar formularios
app.post('/api/register', registrarCliente);
app.post('/api/login', loginCliente);

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});