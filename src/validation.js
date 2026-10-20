// Validaciones reutilizables de solicitudes.
// Se aplica a los textos normalizados (trim incluido).

import { CATEGORIES, PRIORITIES, STATUSES } from './constants'

// Devuelve el texto sin espacios al principio ni al final.
export function trimValue(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// Valida los campos de una solicitud.
// `includeStatus` habilita la validación del estado (solo en edición).
// Devuelve un objeto de errores; vacío si los datos son válidos.
export function validateRequest(values, { includeStatus = false } = {}) {
  const errors = {}
  const title = trimValue(values.title)
  const description = trimValue(values.description)

  if (!title) {
    errors.title = 'El título es obligatorio.'
  } else if (title.length < 5 || title.length > 80) {
    errors.title = 'El título debe tener entre 5 y 80 caracteres.'
  }

  if (!description) {
    errors.description = 'La descripción es obligatoria.'
  } else if (description.length < 10 || description.length > 500) {
    errors.description = 'La descripción debe tener entre 10 y 500 caracteres.'
  }

  if (!values.category || !CATEGORIES.includes(values.category)) {
    errors.category = 'Debes seleccionar una categoría válida.'
  }

  if (!values.priority || !PRIORITIES.includes(values.priority)) {
    errors.priority = 'Debes seleccionar una prioridad válida.'
  }

  if (includeStatus && (!values.status || !STATUSES.includes(values.status))) {
    errors.status = 'Debes seleccionar un estado válido.'
  }

  return errors
}
