import { Router } from 'express';
import { Page } from '../models/Page';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middleware/auth';

const router: Router = Router();
const authMiddleware = new AuthMiddleware();

router.use(authMiddleware.authenticate);


const getAllPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const pages = await Page.find({ userId: req.user.id })
      .select('title slug status metadata.updatedAt')
      .sort({ 'metadata.updatedAt': -1 });

    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving pages' });
  }
}

const getPageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = await Page.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving page' });
  }
}

const createPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, rootComponent, metadata } = req.body;

    // Check if page with slug already exists
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      res.status(400).json({ error: 'A page with this slug already exists' });
      return;
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
    res.status(500).json({ error: 'Error creating page' });
  }
}
const deletePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Page.deleteOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting page' });
  }
}

const updatePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, rootComponent, metadata, status } = req.body;

    // Check if page exists and belongs to user
    const page = await Page.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    // Update fields
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
    res.status(500).json({ error: 'Error updating page' });
  }
}
// Obtener todas las páginas
router.get('/', getAllPages);

// Obtener página por ID
router.get('/:id', getPageById);

// Crear nueva página
router.post('/', createPage);

// Actualizar página
router.put('/:id', updatePage);

// Eliminar página
router.delete('/:id', deletePage);



export default router