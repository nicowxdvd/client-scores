import { useState } from 'react'
import { LoginForm } from './components/LoginForm'
import { ScoreView } from './components/ScoreView'
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

  return <ScoreView token={token} onLogout={handleLogout} />
}

export default App
