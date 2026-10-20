import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, PRIORITIES, STATUSES } from '../constants'

// Formulario compartido de creación y edición de solicitudes.
// Muestra errores por campo y registra los valores normalizados.
export default function RequestForm({ initial = {}, includeStatus = false, submitLabel = 'Guardar', onSubmit }) {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    title: initial.title || '',
    description: initial.description || '',
    category: initial.category || '',
    priority: initial.priority || '',
    status: initial.status || '',
  })
  const [errors, setErrors] = useState({})

  function setValue(name, value) {
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = onSubmit(values, setErrors)
    // Si onSubmit devuelve errores, se muestran junto a los campos.
    if (result) setErrors(result)
  }

  return (
    <form onSubmit={handleSubmit} noValidate data-testid="request-form">
      <div className="field">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(event) => setValue('title', event.target.value)}
          maxLength={200}
          data-testid="field-title"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p className="field-error" id="title-error" role="alert" data-testid="title-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          rows={5}
          value={values.description}
          onChange={(event) => setValue('description', event.target.value)}
          data-testid="field-description"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p className="field-error" id="description-error" role="alert" data-testid="description-error">
            {errors.description}
          </p>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            value={values.category}
            onChange={(event) => setValue('category', event.target.value)}
            data-testid="field-category"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'category-error' : undefined}
          >
            <option value="">Seleccionar…</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="field-error" id="category-error" role="alert" data-testid="category-error">
              {errors.category}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="priority">Prioridad</label>
          <select
            id="priority"
            value={values.priority}
            onChange={(event) => setValue('priority', event.target.value)}
            data-testid="field-priority"
            aria-invalid={Boolean(errors.priority)}
            aria-describedby={errors.priority ? 'priority-error' : undefined}
          >
            <option value="">Seleccionar…</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="field-error" id="priority-error" role="alert" data-testid="priority-error">
              {errors.priority}
            </p>
          )}
        </div>

        {includeStatus && (
          <div className="field">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              value={values.status}
              onChange={(event) => setValue('status', event.target.value)}
              data-testid="field-status"
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? 'status-error' : undefined}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="field-error" id="status-error" role="alert" data-testid="status-error">
                {errors.status}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={() => navigate('/')} data-testid="cancel-button">
          Cancelar
        </button>
        <button type="submit" className="primary" data-testid="save-button">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
