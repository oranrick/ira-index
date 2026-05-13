import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { supabase } from './supabaseClient.js'
import './styles/global.css'

// Procesa el callback de confirmación de email de Supabase.
// Supabase puede enviar el token de dos formas:
//   1. Hash fragment:  #access_token=...&type=signup  (implicit flow)
//   2. Query params:   ?token_hash=...&type=signup     (PKCE flow)
async function handleAuthCallback() {
  const hash = window.location.hash
  const params = new URLSearchParams(window.location.search)

  const hasHashToken = hash.includes('access_token') || hash.includes('token_hash')
  const hasQueryToken = params.has('token_hash') || params.has('code')

  if (!hasHashToken && !hasQueryToken) return

  try {
    if (params.has('code')) {
      // PKCE authorization code flow
      await supabase.auth.exchangeCodeForSession(params.get('code'))
    } else if (params.has('token_hash')) {
      // token_hash + type en query string
      await supabase.auth.verifyOtp({
        token_hash: params.get('token_hash'),
        type: params.get('type') ?? 'signup',
      })
    } else if (hash.includes('access_token')) {
      // Implicit flow: Supabase JS lo maneja automáticamente al leer el hash,
      // pero llamamos getSession para asegurarnos de que la sesión quede activa.
      await supabase.auth.getSession()
    }
    // Marca para que App muestre el toast de éxito
    sessionStorage.setItem('ira-email-confirmed', '1')
  } catch (e) {
    console.error('Auth callback error:', e)
  }

  // Limpia la URL de parámetros de confirmación
  window.history.replaceState({}, document.title, window.location.pathname)
}

handleAuthCallback().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
})
