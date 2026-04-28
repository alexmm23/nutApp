import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { supabase } from '../../lib/supabaseClient'
import useSupabaseAuth from '../../hooks/useSupabaseAuth'
import styles from './Auth.module.css'

export default function Auth() {
  const { user } = useSupabaseAuth()

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.error('Error signInWithOAuth:', error.message)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error.message)
  }

  if (user) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.userInfo}>
          <img
            className={styles.avatar}
            src={user.user_metadata?.avatar_url || ''}
            alt="avatar"
          />
          <span className={styles.email}>
            {user.email ?? user.user_metadata?.email}
          </span>
        </div>
        <button
          className={`${styles.button} ${styles.signOutButton}`}
          onClick={signOut}
        >
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <div className={styles.authContainer}>
      <button
        className={styles.iconButton}
        onClick={signInWithGoogle}
        title="Iniciar sesión con Google"
      >
        <FcGoogle size={24} />
      </button>
    </div>
  )
}
