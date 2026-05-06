import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export function AuthModal({ onSuccess, onClose }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  const handleClose = () => {
    setMounted(false)
    setTimeout(onClose, 220)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: authError } =
        mode === 'login'
          ? await signIn(email, password)
          : await signUp(email, password)
      if (authError) {
        setError(authError.message)
      } else {
        onSuccess?.()
      }
    } catch (err) {
      setError(err.message ?? 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.22s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0e0e14',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '20px',
          padding: '36px 32px',
          width: '100%',
          maxWidth: '400px',
          transform: mounted ? 'translateY(0)' : 'translateY(18px)',
          transition: 'transform 0.22s ease',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#ff6600', boxShadow: '0 0 8px #ff6600',
            }} />
            <span style={{
              fontSize: '9px', letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
            }}>
              {isLogin ? 'Acceso' : 'Registro'}
            </span>
          </div>
          <h2 style={{
            margin: 0, fontSize: '22px', fontWeight: 800,
            color: '#fff', fontFamily: "'Syne',sans-serif",
            letterSpacing: '-0.03em',
          }}>
            {isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{
              display: 'block', marginBottom: '6px',
              fontSize: '10px', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
              fontFamily: "'DM Mono',monospace",
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '11px 14px',
                color: '#fff', fontSize: '13px',
                outline: 'none', fontFamily: "'DM Mono',monospace",
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block', marginBottom: '6px',
              fontSize: '10px', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
              fontFamily: "'DM Mono',monospace",
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '11px 14px',
                color: '#fff', fontSize: '13px',
                outline: 'none', fontFamily: "'DM Mono',monospace",
              }}
            />
          </div>

          {error && (
            <p style={{
              margin: 0, padding: '10px 14px',
              background: 'rgba(224,82,82,0.1)',
              border: '1px solid rgba(224,82,82,0.3)',
              borderRadius: '8px',
              fontSize: '12px', color: '#e05252',
              fontFamily: "'DM Mono',monospace",
              lineHeight: 1.5,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = '#ff8533'
                e.currentTarget.style.boxShadow = '0 0 32px rgba(255,102,0,0.55)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = loading ? 'rgba(255,102,0,0.4)' : '#ff6600'
              e.currentTarget.style.boxShadow = loading ? 'none' : '0 0 24px rgba(255,102,0,0.35)'
            }}
            style={{
              marginTop: '4px',
              padding: '13px 28px', borderRadius: '12px',
              background: loading ? 'rgba(255,102,0,0.4)' : '#ff6600',
              border: 'none',
              color: loading ? 'rgba(0,0,0,0.5)' : '#000',
              fontSize: '13px', fontWeight: 700,
              letterSpacing: '0.04em', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Mono',monospace",
              boxShadow: loading ? 'none' : '0 0 24px rgba(255,102,0,0.35)',
              transition: 'all 0.2s ease',
              width: '100%',
            }}
          >
            {loading
              ? (isLogin ? 'Entrando...' : 'Creando cuenta...')
              : (isLogin ? 'Entrar →' : 'Crear cuenta →')}
          </button>
        </form>

        {/* Toggle */}
        <div style={{
          marginTop: '22px', paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          </span>
          <button
            onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(null) }}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#ff6600', fontSize: '12px', cursor: 'pointer',
              fontFamily: "'DM Mono',monospace", fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: '20px', right: '20px',
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.25)', fontSize: '18px',
            cursor: 'pointer', lineHeight: 1, padding: '4px',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
