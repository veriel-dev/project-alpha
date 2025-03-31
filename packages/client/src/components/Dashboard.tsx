import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pageService } from '../services/pageService';
import { useToast } from '../context/ToastContext';

const Dashboard: React.FC = () => {
  const [recentPages, setRecentPages] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        // Cargar datos de páginas
        const pages = await pageService.getAllPages();

        // Filtrar las páginas recientes (últimas 5)
        const recent = pages.slice(0, 5);
        setRecentPages(recent);

        // Calcular estadísticas
        setStats({
          totalPages: pages.length,
          publishedPages: pages.filter(p => p.status === 'published').length,
          draftPages: pages.filter(p => p.status === 'draft').length,
        });
      } catch (error) {
        addToast('error', 'Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [addToast]);

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total de Páginas</h3>
          <div className="stat-value">{stats.totalPages}</div>
        </div>
        <div className="stat-card">
          <h3>Páginas Publicadas</h3>
          <div className="stat-value">{stats.publishedPages}</div>
        </div>
        <div className="stat-card">
          <h3>Borradores</h3>
          <div className="stat-value">{stats.draftPages}</div>
        </div>
      </div>

      <div className="recent-pages">
        <div className="section-header">
          <h2>Páginas Recientes</h2>
          <Link to="/pages" className="view-all">Ver todas</Link>
        </div>

        {recentPages.length > 0 ? (
          <div className="page-list">
            {recentPages.map(page => (
              <div key={page._id} className="page-item">
                <div className="page-info">
                  <h3>{page.title}</h3>
                  <div className="page-meta">
                    <span className={`status status-${page.status}`}>
                      {page.status === 'published' ? 'Publicada' : 'Borrador'}
                    </span>
                    <span className="date">
                      Actualizada: {new Date(page.metadata.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="page-actions">
                  <Link to={`/editor/${page._id}`} className="edit-button">Editar</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tienes páginas creadas todavía.</p>
            <Link to="/editor" className="create-button">Crear nueva página</Link>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="action-buttons">
          <Link to="/editor" className="action-button primary">
            Crear Nueva Página
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;