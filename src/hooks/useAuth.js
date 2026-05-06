import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    if (!userId) { setProfile(null); return }
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('user_id', userId)
      .single()
    setProfile(data ?? null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      fetchProfile(session?.user?.id ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      fetchProfile(session?.user?.id ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = (email, password, options = {}) =>
    supabase.auth.signUp({ email, password, options })

  const signIn = (email, password, options = {}) =>
    supabase.auth.signInWithPassword({ email, password, options })

  const signOut = () =>
    supabase.auth.signOut()

  return { user, profile, loading, signUp, signIn, signOut }
}
