import { useNavigate } from 'react-router-dom'
import RequestForm from '../components/RequestForm'
import { INITIAL_STATUS } from '../constants'
import { addRequest, generateId } from '../storage'
import { trimValue, validateRequest } from '../validation'

// Pantalla de creación de una nueva solicitud.
export default function NewRequest() {
  const navigate = useNavigate()

  function handleSubmit(values, setErrors) {
    const errors = validateRequest(values)
    if (Object.keys(errors).length > 0) return errors

    const now = new Date().toISOString()
    const request = {
      id: generateId(),
      title: trimValue(values.title),
      description: trimValue(values.description),
      category: values.category,
      priority: values.priority,
      status: INITIAL_STATUS,
      createdAt: now,
      updatedAt: now,
    }

    const saved = addRequest(request)
    if (!saved) {
      return { title: 'No se pudo guardar la solicitud. Inténtalo de nuevo.' }
    }
    navigate('/', { state: { message: `Solicitud "${saved.title}" creada correctamente.` } })
  }

  return (
    <div className="page-narrow" data-testid="new-request-page">
      <div className="page-header">
        <h2>Crear solicitud</h2>
      </div>
      <p className="page-hint">El estado inicial de una nueva solicitud siempre es «Pendiente».</p>
      <RequestForm submitLabel="Crear solicitud" onSubmit={handleSubmit} />
    </div>
  )
}
