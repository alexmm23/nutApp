import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080'
const PROFILE_STORAGE_PREFIX = 'nutapp.profile'

let lastSyncedSessionToken = null
let profileSyncPromise = null

function getProfileStorageKey(userId) {
  return `${PROFILE_STORAGE_PREFIX}:${userId}`
}

function getGoogleProfilePayload(user) {
  const identityData = user?.identities?.[0]?.identity_data
  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    identityData?.avatar_url ||
    identityData?.picture ||
    ''

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.given_name ||
    (user?.email ? user.email.split('@')[0] : '')

  return {
    google_id: user?.id,
    name,
    email: user?.email || user?.user_metadata?.email || '',
    avatar_url: avatarUrl,
  }
}

async function syncGoogleProfile(sessionUser) {
  if (!sessionUser) return null

  const sessionToken = sessionUser?.id || null

  if (lastSyncedSessionToken === sessionToken && profileSyncPromise === null) {
    const cachedProfile = window.localStorage.getItem(
      getProfileStorageKey(sessionUser.id)
    )

    return cachedProfile ? JSON.parse(cachedProfile) : null
  }

  if (profileSyncPromise) {
    return profileSyncPromise
  }

  profileSyncPromise = (async () => {
    const payload = getGoogleProfilePayload(sessionUser)

    try {
      const response = await fetch(`${BACKEND_URL}/profiles/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Backend responded with status ${response.status}`)
      }

      const data = await response.json()
      const profile = {
        profileId: data.profile_id ?? null,
        familyId: data.family_id ?? null,
        created: Boolean(data.created),
        message: data.message ?? '',
        data: data.data ?? null,
        googleId: payload.google_id,
        name: payload.name,
        email: payload.email,
        avatarUrl: payload.avatar_url,
      }

      window.localStorage.setItem(
        getProfileStorageKey(sessionUser.id),
        JSON.stringify(profile)
      )
      lastSyncedSessionToken = sessionToken

      return profile
    } catch (error) {
      console.error('Error syncing Google profile:', error.message)

      const cachedProfile = window.localStorage.getItem(
        getProfileStorageKey(sessionUser.id)
      )

      if (cachedProfile) {
        lastSyncedSessionToken = sessionToken
        return JSON.parse(cachedProfile)
      }

      throw error
    } finally {
      profileSyncPromise = null
    }
  })()

  return profileSyncPromise
}

export default function useSupabaseAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState(null)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const session = data.session ?? null
      const nextUser = session?.user ?? null

      setUser(nextUser)

      if (!nextUser) {
        setProfile(null)
        setProfileError(null)
        return
      }

      setProfileLoading(true)
      syncGoogleProfile(nextUser)
        .then((syncedProfile) => {
          if (!mounted) return
          setProfile(syncedProfile)
        })
        .catch((error) => {
          if (!mounted) return
          setProfileError(error.message)
        })
        .finally(() => {
          if (!mounted) return
          setProfileLoading(false)
        })
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null
        setUser(nextUser)

        if (!nextUser) {
          setProfile(null)
          setProfileError(null)
          lastSyncedSessionToken = null
          return
        }

        setProfileLoading(true)
        syncGoogleProfile(nextUser)
          .then((syncedProfile) => {
            setProfile(syncedProfile)
          })
          .catch((error) => {
            setProfileError(error.message)
          })
          .finally(() => {
            setProfileLoading(false)
          })
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

  return { user, profile, profileLoading, profileError }
}
