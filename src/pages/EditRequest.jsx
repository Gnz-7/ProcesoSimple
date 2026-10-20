import { useNavigate, useParams } from 'react-router-dom'
import RequestForm from '../components/RequestForm'
import { getRequestById, updateRequest } from '../storage'
import { trimValue, validateRequest } from '../validation'

// Pantalla de edición de una solicitud existente.
export default function EditRequest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const request = getRequestById(id)

  // Identificador inexistente: se informa, no se crea nada por accidente.
  if (!request) {
    return (
      <div className="page-narrow" data-testid="request-not-found">
        <div className="page-header">
          <h2>Solicitud no encontrada</h2>
        </div>
        <p className="empty-message">
          No existe una solicitud con el identificador <code>{id}</code>. No es posible editarla.
        </p>
        <button type="button" onClick={() => navigate('/')} data-testid="back-to-list">
          Volver al listado
        </button>
      </div>
    )
  }

  function handleSubmit(values, setErrors) {
    const errors = validateRequest(values, { includeStatus: true })
    if (Object.keys(errors).length > 0) return errors

    const updated = updateRequest(id, {
      title: trimValue(values.title),
      description: trimValue(values.description),
      category: values.category,
      priority: values.priority,
      status: values.status,
      updatedAt: new Date().toISOString(),
    })

    if (!updated) {
      return { title: 'No se pudo guardar la solicitud. Inténtalo de nuevo.' }
    }
    navigate(`/solicitudes/${id}`, { state: { message: `Solicitud "${updated.title}" actualizada correctamente.` } })
  }

  return (
    <div className="page-narrow" data-testid="edit-request-page">
      <div className="page-header">
        <h2>Editar solicitud</h2>
      </div>
      <RequestForm
        initial={request}
        includeStatus
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
