import express from 'express';
import { Page } from '../models/Page';
import { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import mongoose, { mongo } from 'mongoose';

const router = express.Router();

router.use(authMiddleware);

// Obtener todas las páginas
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find({ userId: req.user.id })
      .select('title slug status metadata.updatedAt')
      .sort({ 'metadata.updatedAt': -1 });
      
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener páginas' });
  }
});

// Obtener página por ID
router.get('/:id', async (req, res) => {
  try {
    const page = await Page.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!page) {
      return res.status(404).json({ error: 'Página no encontrada' });
    }
    
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la página' });
  }
});

// Crear nueva página
router.post('/', async (req, res) => {
  try {
    const { title, slug, rootComponent, metadata } = req.body;
    
    // Verificar si ya existe una página con ese slug
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return res.status(400).json({ error: 'Ya existe una página con ese slug' });
    }
    
    const page = new Page({
      title,
      slug,
      rootComponent,
      metadata,
      userId: req.user.id,
    });
    
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la página' });
  }
});

// Actualizar página
router.put('/:id', async (req, res) => {
  try {
    const { title, slug, rootComponent, metadata, status } = req.body;
    
    // Verificar si la página existe y pertenece al usuario
    const page = await Page.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!page) {
      return res.status(404).json({ error: 'Página no encontrada' });
    }
    
    // Actualizar campos
    page.title = title;
    page.slug = slug;
    page.rootComponent = rootComponent;
    
    if (metadata) {
      page.metadata = {
        ...page.metadata,
        ...metadata,
        updatedAt: new Date()
      };
    }
    
    if (status) {
      page.status = status;
      if (status === 'published' && !page.metadata.publishedAt) {
        page.metadata.publishedAt = new Date();
      }
    }
    
    await page.save();
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la página' });
  }
});

// Eliminar página
router.delete('/:id', async (req, res) => {
  try {
    const result = await Page.deleteOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Página no encontrada' });
    }
    
    res.json({ message: 'Página eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la página' });
  }
});

export const pageRouter = router;