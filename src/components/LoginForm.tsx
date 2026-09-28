import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, login } from '../api'
import { useToast } from '../useToast'

interface LoginFormProps {
  onLogin: (token: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    try {
      const { accessToken } = await login({ email, password })
      onLogin(accessToken)
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(
          'error',
          error.status === 401
            ? 'Credenciales inválidas'
            : `Error inesperado (código ${error.status})`,
        )
      } else {
        showToast('error', 'No se pudo conectar con el servidor')
      }
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>
      <label>
        Email
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  )
}
