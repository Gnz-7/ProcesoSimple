// Gestión de la sesión simulada en sessionStorage.

import { SESSION_KEY } from './constants'

export function isAuthenticated() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

export function startSession() {
  window.sessionStorage.setItem(SESSION_KEY, 'true')
}

export function endSession() {
  window.sessionStorage.removeItem(SESSION_KEY)
}
