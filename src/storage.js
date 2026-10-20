// Persistencia centralizada de solicitudes en localStorage.
// Todas las pantallas usan este módulo; ninguna toca localStorage por su cuenta.

import { STORAGE_KEY } from './constants'
import { buildSeedRequests } from './seedData'

function isStoredDataValid(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string',
    )
  )
}

// Carga las solicitudes. Si los datos almacenados no son interpretables,
// se recupera de forma controlada restableciendo los datos de prueba.
export function getRequests() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      const seed = buildSeedRequests()
      saveRequests(seed)
      return seed
    }
    const parsed = JSON.parse(raw)
    if (!isStoredDataValid(parsed)) {
      const seed = buildSeedRequests()
      saveRequests(seed)
      return seed
    }
    return parsed
  } catch {
    const seed = buildSeedRequests()
    saveRequests(seed)
    return seed
  }
}

export function saveRequests(requests) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
    return true
  } catch {
    return false
  }
}

export function addRequest(request) {
  const requests = getRequests()
  const next = [...requests, request]
  return saveRequests(next) ? request : null
}

export function updateRequest(id, changes) {
  const requests = getRequests()
  const index = requests.findIndex((request) => request.id === id)
  if (index === -1) return null
  const updated = {
    ...requests[index],
    ...changes,
    id: requests[index].id,
    createdAt: requests[index].createdAt,
  }
  const next = [...requests]
  next[index] = updated
  return saveRequests(next) ? updated : null
}

export function deleteRequest(id) {
  const requests = getRequests()
  const next = requests.filter((request) => request.id !== id)
  if (next.length === requests.length) return false
  return saveRequests(next)
}

export function getRequestById(id) {
  return getRequests().find((request) => request.id === id) || null
}

// Reemplaza las solicitudes actuales por los datos iniciales definidos en el
// código. Idempotente: ejecutarla varias veces produce el mismo conjunto.
export function resetRequests() {
  const seed = buildSeedRequests()
  return saveRequests(seed) ? seed : null
}

export function generateId() {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `req-${Date.now().toString(36)}-${random}`
}
