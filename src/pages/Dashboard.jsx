import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import { STATUSES } from '../constants'
import { deleteRequest, getRequests, resetRequests } from '../storage'

// Pantalla principal: listado de solicitudes con búsqueda y filtro por estado.
export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  // Mensaje de éxito procedente de otra pantalla (creación, edición, borrado).
  const [flashMessage, setFlashMessage] = useState(location.state?.message || '')
  const [requests, setRequests] = useState(() => getRequests())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [resetOpen, setResetOpen] = useState(false)

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase()
    return requests.filter((request) => {
      const matchesSearch = query === '' || request.title.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'Todos' || request.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [requests, search, statusFilter])

  function refresh() {
    setRequests(getRequests())
  }

  function handleDeleteConfirm() {
    if (deleteRequest(pendingDelete.id)) {
      setFlashMessage(`Solicitud "${pendingDelete.title}" eliminada.`)
    }
    setPendingDelete(null)
    refresh()
  }

  function handleResetConfirm() {
    if (resetRequests()) {
      setFlashMessage('Los datos de prueba han sido restablecidos.')
    }
    setResetOpen(false)
    refresh()
  }

  return (
    <div data-testid="dashboard">
      <div className="page-header">
        <h2>Listado de solicitudes</h2>
        <div className="page-actions">
          <button type="button" onClick={() => setResetOpen(true)} data-testid="reset-data-button">
            Restablecer datos de prueba
          </button>
          <Link to="/solicitudes/nueva" className="button primary" data-testid="new-request-button">
            Nueva solicitud
          </Link>
        </div>
      </div>

      {flashMessage && (
        <p className="alert-success" role="status" data-testid="success-message">
          {flashMessage}
        </p>
      )}

      <div className="filters">
        <div className="field">
          <label htmlFor="search">Buscar por título</label>
          <input
            id="search"
            type="search"
            placeholder="Escribe parte del título…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            data-testid="search-input"
          />
        </div>
        <div className="field">
          <label htmlFor="status-filter">Filtrar por estado</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            data-testid="status-filter"
          >
            <option value="Todos">Todos</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="empty-message" data-testid="empty-message">
          No hay solicitudes que coincidan con la búsqueda o el filtro actual. Puedes crear una nueva
          solicitud con el botón «Nueva solicitud».
        </p>
      ) : (
        <table className="requests-table" data-testid="requests-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha de creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id} data-testid="request-row" data-id={request.id}>
                <td data-testid="request-title">{request.title}</td>
                <td>{request.category}</td>
                <td>{request.priority}</td>
                <td>
                  <StatusBadge status={request.status} />
                </td>
                <td>{new Date(request.createdAt).toLocaleDateString('es-ES')}</td>
                <td className="row-actions">
                  <button
                    type="button"
                    onClick={() => navigate(`/solicitudes/${request.id}`)}
                    data-testid={`view-${request.id}`}
                  >
                    Ver
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/solicitudes/${request.id}/editar`)}
                    data-testid={`edit-${request.id}`}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => setPendingDelete(request)}
                    data-testid={`delete-${request.id}`}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Eliminar solicitud"
        message={`¿Seguro que deseas eliminar la solicitud "${pendingDelete?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
      <ConfirmDialog
        open={resetOpen}
        title="Restablecer datos de prueba"
        message="Se reemplazarán las solicitudes actuales por los datos de ejemplo iniciales. Tu sesión no se cerrará. ¿Deseas continuar?"
        confirmLabel="Restablecer"
        onConfirm={handleResetConfirm}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  )
}
