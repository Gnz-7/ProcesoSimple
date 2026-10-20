import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import { deleteRequest, getRequestById } from '../storage'

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleString('es-ES')
}

// Pantalla de detalle de una solicitud existente.
export default function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [flashMessage] = useState(location.state?.message || '')
  const [request] = useState(() => getRequestById(id))
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Identificador inexistente: mensaje claro sin romper el renderizado.
  if (!request) {
    return (
      <div className="page-narrow" data-testid="request-not-found">
        <div className="page-header">
          <h2>Solicitud no encontrada</h2>
        </div>
        <p className="empty-message">
          No existe una solicitud con el identificador <code>{id}</code>.
        </p>
        <Link to="/" className="button" data-testid="back-to-list">
          Volver al listado
        </Link>
      </div>
    )
  }

  function handleDeleteConfirm() {
    if (deleteRequest(request.id)) {
      navigate('/', { state: { message: `Solicitud "${request.title}" eliminada.` } })
    } else {
      setConfirmOpen(false)
    }
  }

  return (
    <div className="page-narrow" data-testid="request-detail">
      <div className="page-header">
        <h2>Detalle de solicitud</h2>
        <div className="page-actions">
          <Link to="/" className="button" data-testid="back-to-list">
            Volver al listado
          </Link>
          <Link to={`/solicitudes/${request.id}/editar`} className="button" data-testid="edit-request-button">
            Editar
          </Link>
          <button type="button" className="danger" onClick={() => setConfirmOpen(true)} data-testid="delete-request-button">
            Eliminar
          </button>
        </div>
      </div>

      {flashMessage && (
        <p className="alert-success" role="status" data-testid="success-message">
          {flashMessage}
        </p>
      )}

      <dl className="detail-list">
        <div>
          <dt>Identificador</dt>
          <dd data-testid="detail-id">{request.id}</dd>
        </div>
        <div>
          <dt>Título</dt>
          <dd data-testid="detail-title">{request.title}</dd>
        </div>
        <div>
          <dt>Descripción</dt>
          <dd data-testid="detail-description">{request.description}</dd>
        </div>
        <div>
          <dt>Categoría</dt>
          <dd data-testid="detail-category">{request.category}</dd>
        </div>
        <div>
          <dt>Prioridad</dt>
          <dd data-testid="detail-priority">{request.priority}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd data-testid="detail-status">
            <StatusBadge status={request.status} />
          </dd>
        </div>
        <div>
          <dt>Fecha de creación</dt>
          <dd data-testid="detail-created-at">{formatDate(request.createdAt)}</dd>
        </div>
        <div>
          <dt>Última modificación</dt>
          <dd data-testid="detail-updated-at">{formatDate(request.updatedAt)}</dd>
        </div>
      </dl>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar solicitud"
        message={`¿Seguro que deseas eliminar la solicitud "${request.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
