

import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import pageRoutes from '../routes/pageRoutes';
import userRoutes from '../routes/userRoutes';
import assetRoutes from '../routes/assetRoutes';
import { dbConnect } from '../config/db';
export class App {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000');

    this.connectDatabase();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }
  private setupMiddleware(): void {
    // Configure middleware
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Serve static files
    this.app.use(express.static(path.join(__dirname, '../public')));
  }
  private setupRoutes(): void {
    this.app.use('/api/pages', pageRoutes);
    this.app.use('/api/assets', assetRoutes);
    this.app.use('/api/users', userRoutes);
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
    // Server client application
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }
  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error:', err.message);
      res.status(err.status || 500).json({
        error: {
          message: err.message || 'Internal Server Error',
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
      });
    });
  }
  public async connectDatabase(): Promise<void> {
    await dbConnect();
  }
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`);
    });
  }
}