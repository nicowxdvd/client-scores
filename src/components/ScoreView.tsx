import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, getScore } from '../api'
import { useToast } from '../useToast'
import type { ScoreResponse } from '../types'

interface ScoreViewProps {
  token: string
  onLogout: () => void
}

const RUT_PATTERN = /^[0-9.\-kK]+$/

function formatRut(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length < 2) return clean
  const body = clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${body}-${clean.slice(-1)}`
}

export function ScoreView({ token, onLogout }: ScoreViewProps) {
  const { showToast } = useToast()
  const [rut, setRut] = useState('')
  const [validation, setValidation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScoreResponse | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = rut.trim()
    if (!value || !RUT_PATTERN.test(value)) {
      setValidation('Ingresa un RUT válido (dígitos, puntos, guion y K)')
      return
    }
    setValidation(null)
    setLoading(true)
    try {
      setResult(await getScore(token, value))
    } catch (error) {
      setResult(null)
      if (!(error instanceof ApiError)) {
        showToast('error', 'No se pudo conectar con el servidor')
      } else if (error.status === 401) {
        showToast('error', 'Sesión vencida. Ingresa nuevamente')
        onLogout()
      } else if ([400, 403, 404].includes(error.status)) {
        showToast('error', `RUT no permitido: ${error.message}`)
      } else {
        showToast('error', `Error inesperado (código ${error.status})`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="card">
      <h1>Consultar score</h1>
      <form onSubmit={handleSubmit}>
        <label>
          RUT
          <input
            type="text"
            inputMode="text"
            maxLength={12}
            placeholder="11.111.111-1"
            value={rut}
            onChange={(event) => setRut(event.target.value)}
          />
        </label>
        {validation && <p role="alert">{validation}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </form>
      {result && (
        <dl>
          <dt>RUT</dt>
          <dd>{formatRut(result.rut)}</dd>
          <dt>Score</dt>
          <dd>{result.score}</dd>
          <dt>Fecha</dt>
          <dd>{new Date(result.fecha).toLocaleString('es-CL')}</dd>
        </dl>
      )}
      <button type="button" onClick={onLogout}>
        Cerrar sesión
      </button>
    </main>
  )
}
