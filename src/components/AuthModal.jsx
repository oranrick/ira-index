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
    usernameLabel:     'Nombre de usuario',
    usernameTaken:     'Este nombre de usuario ya está en uso.',
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
    usernameLabel:     'Username',
    usernameTaken:     'This username is already taken.',
  },
}


export function AuthModal({ onSuccess, onClose, lang = 'es', defaultMode = 'register' }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState(defaultMode)
  const [username, setUsername] = useState('')
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
        // Pre-check username único antes de crear el usuario en auth
        const { data: existing } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('username', username.trim())
          .maybeSingle()
        if (existing) {
          setError(T.usernameTaken)
          return
        }

        const { data, error: authError } = await signUp(email, password, {
          captchaToken,
          emailRedirectTo: 'https://ira-index.vercel.app',
        })
        if (authError) {
          setError(authError.message)
          resetCaptcha()
          return
        }
        if (data?.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            user_id: data.user.id,
            username: username.trim(),
            birth_date: birthDate || null,
            gender: gender || T.genderOptions[0],
          })
          if (profileError?.code === '23505') {
            setError(T.usernameTaken)
            resetCaptcha()
            return
          }
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
        background: 'rgba(4,20,20,0.72)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.22s ease',
      }}
    >
      <div
        role="dialog" aria-modal="true" aria-labelledby="ira-auth-titulo"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'var(--ira-superficie)',
          border: '1px solid var(--ira-linea)',
          borderRadius: 'var(--ira-radio-xl)',
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
            <span style={{ fontSize: '13px', color: 'var(--ira-oro)' }}>
              {isLogin ? T.tagLogin : T.tagRegister}
            </span>
          </div>
          <h2 id="ira-auth-titulo" style={{
            margin: 0, fontSize: '30px', fontWeight: 500, lineHeight: 1.15,
            color: "var(--ira-nieve)", fontFamily: "var(--ira-font-titulo)",
            letterSpacing: '-0.02em', paddingRight: '48px',
          }}>
            {isLogin ? T.titleLogin : T.titleRegister}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Username — solo registro */}
          {!isLogin && (
            <div>
              <label htmlFor="ira-auth-username" className="ira-rotulo">{T.usernameLabel}</label>
              <input
                id="ira-auth-username" className="ira-campo"
                type="text" value={username}
                onChange={e => setUsername(e.target.value)}
                required autoComplete="username"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="ira-auth-email" className="ira-rotulo">{T.email}</label>
            <input
              id="ira-auth-email" className="ira-campo"
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="ira-auth-password" className="ira-rotulo">{T.password}</label>
            <input
              id="ira-auth-password" className="ira-campo"
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              required autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {/* Register-only fields */}
          {!isLogin && (
            <>
              <div>
                <label htmlFor="ira-auth-birthDate" className="ira-rotulo">{T.birthDate}</label>
                <input
                  id="ira-auth-birthDate" className="ira-campo"
                  type="date" value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label htmlFor="ira-auth-gender" className="ira-rotulo">{T.gender}</label>
                <select
                  id="ira-auth-gender" className="ira-campo"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  style={{
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23A9B8B8' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '36px',
                  }}
                >
                  {T.genderOptions.map(opt => (
                    <option key={opt} value={opt} style={{ background: '#0A1E1E' }}>{opt}</option>
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
            <p role="alert" style={{
              margin: 0, padding: '10px 14px',
              background: 'rgba(190,40,26,0.12)',
              border: '1px solid rgba(190,40,26,0.45)',
              borderRadius: '8px',
              fontSize: '14px', color: 'var(--ira-marca-polarizante)',
              fontFamily: "var(--ira-font-texto)",
              lineHeight: 1.5,
            }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="ira-boton ira-boton--principal"
            style={{ marginTop: '4px', width: '100%' }}
          >
            {loading
              ? (isLogin ? T.loadingLogin : T.loadingRegister)
              : (isLogin ? T.btnLogin : T.btnRegister)}
          </button>
        </form>

        {/* Toggle */}
        <div style={{
          marginTop: '22px', paddingTop: '20px',
          borderTop: '1px solid var(--ira-linea)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '14px', color: "var(--ira-texto-2)" }}>
            {isLogin ? T.noAccount : T.hasAccount}
          </span>
          <button
            type="button"
            onClick={() => switchMode(isLogin ? 'register' : 'login')}
            style={{
              background: 'none', border: 'none', padding: '12px 4px',
              color: 'var(--ira-oro)', fontSize: '14px', cursor: 'pointer',
              fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '3px',
            }}
          >
            {isLogin ? T.switchRegister : T.switchLogin}
          </button>
        </div>

        {/* Close */}
        <button
          type="button"
          aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
          onClick={handleClose}
          className="ira-boton ira-boton--secundario ira-boton--icono"
          style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '14px' }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
