import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function useSupabaseAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      mounted = false
      // unsubscribe if available
      if (
        listener &&
        listener.subscription &&
        typeof listener.subscription.unsubscribe === 'function'
      ) {
        listener.subscription.unsubscribe()
      }
    }
  }, [])

  return { user }
}
