// Etiqueta visual del estado de una solicitud.
const STATUS_CLASS = {
  Pendiente: 'status-pendiente',
  'En progreso': 'status-progreso',
  Completada: 'status-completada',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${STATUS_CLASS[status] || ''}`} data-testid="status-badge">
      {status}
    </span>
  )
}
