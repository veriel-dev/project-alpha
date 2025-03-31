import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import { config } from './config';
import { pageRouter } from './routes/pageRoutes';
import { assetRouter } from './routes/assetRoutes';
import { userRouter } from './routes/userRoutes';

// Create app 
const app = express();
const PORT = process.env.PORT || 3000;

// Config Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Conectar a MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Conexión a MongoDB establecida');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });

  // Rutas API
app.use('/api/pages', pageRouter);
app.use('/api/assets', assetRouter);
app.use('/api/users', userRouter);

// Ruta para servir la aplicación cliente
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
