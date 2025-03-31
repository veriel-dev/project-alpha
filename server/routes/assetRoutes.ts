import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { authMiddleware } from '../middleware/auth';


const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../', config.uploadDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = uuidv4();
    cb(null, uniquePrefix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // Permitir solo ciertos tipos de archivos
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml',
      'application/pdf', 'text/css', 'application/javascript'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
      return;
    }
  }
});

// Middleware de autenticación
router.use(authMiddleware);

// Subir un archivo
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }
    
    // Devolver la URL del archivo subido
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
});

// Eliminar un archivo
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../', config.uploadDir, filename);
    
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    // Eliminar el archivo
    fs.unlinkSync(filePath);
    
    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el archivo' });
  }
});

export const assetRouter = router;