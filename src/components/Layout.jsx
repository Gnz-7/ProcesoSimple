import { Outlet, useNavigate } from 'react-router-dom'
import { APP_TITLE } from '../constants'
import { endSession } from '../session'

// Cabecera común de las páginas internas: título, usuario y cierre de sesión.
export default function Layout() {
  const navigate = useNavigate()

  function handleLogout() {
    endSession()
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <header className="app-header">
        <h1 className="app-title">{APP_TITLE}</h1>
        <div className="header-actions">
          <span className="user-indicator" data-testid="user-indicator">
            Usuario: <strong>alumno</strong>
          </span>
          <button type="button" onClick={handleLogout} data-testid="logout-button">
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
