const TOKEN_KEY = 'client-scores:token'

// sessionStorage puede estar bloqueado por el navegador; la sesión sigue viva en el estado de React.
export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
    return
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    return
  }
}
