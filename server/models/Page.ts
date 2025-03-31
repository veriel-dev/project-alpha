import mongoose, { Schema, Document } from 'mongoose';

export interface IPage extends Document {
  id: string;
  title: string;
  slug: string;
  rootComponent: any;
  metadata: {
    description?: string;
    keywords?: string;
    author?: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
  };
  status: 'draft' | 'published' | 'archived';
  userId: mongoose.Types.ObjectId;
}

const PageSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  rootComponent: { type: Schema.Types.Mixed, required: true },
  metadata: {
    description: { type: String },
    keywords: { type: String },
    author: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date },
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Índices para búsqueda optimizada
PageSchema.index({ slug: 1 });
PageSchema.index({ userId: 1 });
PageSchema.index({ 'metadata.createdAt': -1 });

// Middleware para actualizar fechas
PageSchema.pre('save', function(next) {
  if (this.isModified()) {
    (this as any).metadata.updatedAt = new Date();
  }
  next();
});
// Método para publicar página
PageSchema.methods.publish = function() {
  this.status = 'published';
  this.metadata.publishedAt = new Date();
  return this.save();
};
export const Page = mongoose.model<IPage>('Page', PageSchema);
