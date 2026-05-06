import { useState, useEffect, useRef } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabaseClient'

// Sitekey from Supabase dashboard → Authentication → Settings → Enable Captcha
const HCAPTCHA_SITE_KEY = '8a5e3198-e466-46b4-a548-e85ab842e988'

const TEXTS = {
  es: {
    tagLogin:          'Acceso',
    tagRegister:       'Registro',
    titleLogin:        'Inicia sesión',
    titleRegister:     'Crea tu cuenta',
    email:             'Email',
    password:          'Contraseña',
    birthDate:         'Fecha de nacimiento',
    gender:            'Sexo',
    genderOptions:     ['Prefiero no decirlo', 'Hombre', 'Mujer', 'No binario'],
    btnLogin:          'Entrar →',
    btnRegister:       'Crear cuenta →',
    loadingLogin:      'Entrando...',
    loadingRegister:   'Creando cuenta...',
    hasAccount:        '¿Ya tienes cuenta? ',
    noAccount:         '¿No tienes una cuenta? ',
    switchLogin:       'Inicia sesión',
    switchRegister:    'Regístrate',
    captchaRequired:   'Completa el captcha antes de continuar.',
    confirmEmail:      'Cuenta creada. Revisa tu email para confirmarla antes de iniciar sesión.',
  },
  en: {
    tagLogin:          'Sign in',
    tagRegister:       'Register',
    titleLogin:        'Sign in',
    titleRegister:     'Create your account',
    email:             'Email',
    password:          'Password',
    birthDate:         'Date of birth',
    gender:            'Gender',
    genderOptions:     ['Prefer not to say', 'Male', 'Female', 'Non-binary'],
    btnLogin:          'Sign in →',
    btnRegister:       'Create account →',
    loadingLogin:      'Signing in...',
    loadingRegister:   'Creating account...',
    hasAccount:        'Already have an account? ',
    noAccount:         "Don't have an account? ",
    switchLogin:       'Sign in',
    switchRegister:    'Sign up',
    captchaRequired:   'Please complete the captcha.',
    confirmEmail:      'Account created. Check your email to confirm it before signing in.',
  },
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', padding: '11px 14px',
  color: '#fff', fontSize: '13px',
  outline: 'none', fontFamily: "'DM Mono',monospace",
}

const labelStyle = {
  display: 'block', marginBottom: '6px',
  fontSize: '10px', letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
  fontFamily: "'DM Mono',monospace",
}

export function AuthModal({ onSuccess, onClose, lang = 'es', defaultMode = 'register' }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mounted, setMounted] = useState(false)
  const captchaRef = useRef(null)
  const T = TEXTS[lang] ?? TEXTS.es
  const isLogin = mode === 'login'

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  const switchMode = (next) => {
    setMode(next)
    setError(null)
    setCaptchaToken(null)
    captchaRef.current?.resetCaptcha()
  }

  const handleClose = () => {
    setMounted(false)
    setTimeout(onClose, 220)
  }

  const resetCaptcha = () => {
    captchaRef.current?.resetCaptcha()
    setCaptchaToken(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!captchaToken) {
      setError(T.captchaRequired)
      return
    }
    setError(null)
    setLoading(true)
    try {
      if (isLogin) {
        const { error: authError } = await signIn(email, password, { captchaToken })
        if (authError) { setError(authError.message); resetCaptcha(); return }
        onSuccess?.()
      } else {
        const { data, error: authError } = await signUp(email, password, { captchaToken })
        if (authError) {
          setError(authError.message)
          resetCaptcha()
          return
        }
        if (data?.user) {
          supabase.from('profiles').insert({
            user_id: data.user.id,
            birth_date: birthDate || null,
            gender: gender || T.genderOptions[0],
          }).then(() => {})
        }
        // Si hay sesión activa el usuario ya está logueado; si no, necesita confirmar email
        if (data?.session) {
          onSuccess?.()
        } else {
          setError(T.confirmEmail)
          resetCaptcha()
        }
      }
    } catch (err) {
      setError(err.message ?? 'Error inesperado')
      resetCaptcha()
    } finally {
      setLoading(false)
    }
  }

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
          position: 'relative',
          background: '#0e0e14',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '20px',
          padding: '36px 32px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflowY: 'auto',
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
              {isLogin ? T.tagLogin : T.tagRegister}
            </span>
          </div>
          <h2 style={{
            margin: 0, fontSize: '22px', fontWeight: 800,
            color: '#fff', fontFamily: "'Syne',sans-serif",
            letterSpacing: '-0.03em',
          }}>
            {isLogin ? T.titleLogin : T.titleRegister}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Email */}
          <div>
            <label style={labelStyle}>{T.email}</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>{T.password}</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              required autoComplete={isLogin ? 'current-password' : 'new-password'}
              style={inputStyle}
            />
          </div>

          {/* Register-only fields */}
          {!isLogin && (
            <>
              <div>
                <label style={labelStyle}>{T.birthDate}</label>
                <input
                  type="date" value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  style={{
                    ...inputStyle,
                    colorScheme: 'dark',
                  }}
                />
              </div>

              <div>
                <label style={labelStyle}>{T.gender}</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='rgba(255,255,255,0.3)' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '36px',
                  }}
                >
                  {T.genderOptions.map(opt => (
                    <option key={opt} value={opt} style={{ background: '#0e0e14' }}>{opt}</option>
                  ))}
                </select>
              </div>

            </>
          )}

          {/* hCaptcha — siempre visible (Supabase lo exige en login y registro) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
            <HCaptcha
              ref={captchaRef}
              sitekey={HCAPTCHA_SITE_KEY}
              onVerify={token => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              theme="dark"
            />
          </div>

          {/* Error */}
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

          {/* Submit */}
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
              ? (isLogin ? T.loadingLogin : T.loadingRegister)
              : (isLogin ? T.btnLogin : T.btnRegister)}
          </button>
        </form>

        {/* Toggle */}
        <div style={{
          marginTop: '22px', paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            {isLogin ? T.noAccount : T.hasAccount}
          </span>
          <button
            onClick={() => switchMode(isLogin ? 'register' : 'login')}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#ff6600', fontSize: '12px', cursor: 'pointer',
              fontFamily: "'DM Mono',monospace", fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {isLogin ? T.switchRegister : T.switchLogin}
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
