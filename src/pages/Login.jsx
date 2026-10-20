import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { APP_TITLE, DEMO_PASSWORD, DEMO_USER } from '../constants'
import { isAuthenticated, startSession } from '../session'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  // Con sesión activa, el login redirige al dashboard.
  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(event) {
    event.preventDefault()

    const fieldErrors = {}
    if (!username.trim()) fieldErrors.username = 'El usuario es obligatorio.'
    if (!password) fieldErrors.password = 'La contraseña es obligatoria.'
    // Un nuevo intento limpia el mensaje de error anterior.
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return

    if (username === DEMO_USER && password === DEMO_PASSWORD) {
      startSession()
      navigate('/', { replace: true })
    } else {
      setErrors({ credentials: 'Usuario o contraseña incorrectos.' })
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>{APP_TITLE}</h1>
        <p className="login-subtitle">Entorno de demostración para automatización</p>

        <form onSubmit={handleSubmit} data-testid="login-form" noValidate>
          <div className="field">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              data-testid="login-username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            {errors.username && (
              <p className="field-error" id="username-error" role="alert" data-testid="username-error">
                {errors.username}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              data-testid="login-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p className="field-error" id="password-error" role="alert" data-testid="password-error">
                {errors.password}
              </p>
            )}
          </div>

          {errors.credentials && (
            <p className="alert-error" role="alert" data-testid="login-error">
              {errors.credentials}
            </p>
          )}

          <button type="submit" className="primary" data-testid="login-button">
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  )
}
