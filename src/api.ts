import type { LoginRequest, LoginResponse, ScoreResponse } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function normalizeMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const { message } = body as { message: unknown }
    if (Array.isArray(message)) return message.join('. ')
    if (typeof message === 'string' && message) return message
  }
  return fallback
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)
  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      normalizeMessage(body, `Error ${response.status}`),
    )
  }

  return body as T
}

export function login(credentials: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
}

export function getScore(token: string, rut: string): Promise<ScoreResponse> {
  return request<ScoreResponse>(`/score?rut=${encodeURIComponent(rut)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
