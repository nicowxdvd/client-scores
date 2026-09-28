import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { clearToken, getToken, setToken } from './session'

function App() {
  const [token, setTokenState] = useState<string | null>(getToken)

  function handleLogin(newToken: string) {
    setToken(newToken)
    setTokenState(newToken)
  }

  function handleLogout() {
    clearToken()
    setTokenState(null)
  }

  if (!token) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <main className="card">
      <h1>Sesión activa</h1>
      <button type="button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </main>
  )
}

export default App
