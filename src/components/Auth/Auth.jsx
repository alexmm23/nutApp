import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { supabase } from '../../lib/supabaseClient'
import useSupabaseAuth from '../../hooks/useSupabaseAuth'
import styles from './Auth.module.css'

const FALLBACK_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#1A759F',
  '#FF9F1C',
  '#2EC4B6',
  '#5E60CE',
  '#06D6A0',
  '#E76F51',
]

function getInitialFromUser(user) {
  const email = user?.email || user?.user_metadata?.email || ''
  return email.trim().charAt(0).toUpperCase() || 'U'
}

function hashString(value) {
  return Array.from(value).reduce((hash, char) => hash + char.charCodeAt(0), 0)
}

function getContrastTextColor(hexColor) {
  const cleanHex = hexColor.replace('#', '')
  const r = Number.parseInt(cleanHex.substring(0, 2), 16)
  const g = Number.parseInt(cleanHex.substring(2, 4), 16)
  const b = Number.parseInt(cleanHex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.62 ? '#111827' : '#FFFFFF'
}

function getAvatarData(user) {
  const identityData = user?.identities?.[0]?.identity_data
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    identityData?.avatar_url ||
    identityData?.picture
  const email = user?.email || user?.user_metadata?.email || 'user'
  const colorIndex = hashString(email) % FALLBACK_COLORS.length
  const backgroundColor = FALLBACK_COLORS[colorIndex]

  return {
    avatarUrl,
    initial: getInitialFromUser(user),
    backgroundColor,
    textColor: getContrastTextColor(backgroundColor),
  }
}

export default function Auth() {
  const { user } = useSupabaseAuth()

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'openid email profile',
      },
    })
    if (error) console.error('Error signInWithOAuth:', error.message)
  }

  if (user) {
    const { avatarUrl, initial, backgroundColor, textColor } =
      getAvatarData(user)

    return (
      <div className={styles.authContainer}>
        <div className={styles.userInfo}>
          {avatarUrl ? (
            <img
              className={styles.avatar}
              src={avatarUrl}
              alt="Avatar del usuario"
            />
          ) : (
            <div
              className={styles.avatarFallback}
              aria-label="Avatar generado"
              title="Avatar generado"
              style={{
                backgroundColor,
                color: textColor,
              }}
            >
              {initial}
            </div>
          )}
        </div>
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
