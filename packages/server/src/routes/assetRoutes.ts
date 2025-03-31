import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { AuthMiddleware } from '../middleware/auth';
import { config } from '../config';


const router: Router = express.Router();
const authMiddleware = new AuthMiddleware();

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
router.use(authMiddleware.authenticate);


const uploadFile = (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Return uploaded file URL
    const fileUrl = `/${config!.uploadDir}/${req.file.filename}`;

    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file' });
  }
}
const deleteFile = (req: Request, res: Response): void => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../', config!.uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting file' });
  }
}
// Subir un archivo
router.post('/upload', upload.single('file'), uploadFile);

// Eliminar un archivo
router.delete('/:filename', deleteFile);

export default router;