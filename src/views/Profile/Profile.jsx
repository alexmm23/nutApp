import { Users, Share2, Pencil, Copy } from 'lucide-react'
import styles from './Profile.module.css'
import { useState, useRef } from 'react'
import useSupabaseAuth from '../../hooks/useSupabaseAuth'
import { supabase } from '../../lib/supabaseClient'
import FormInput from '../../components/FormInput/FormInput'
import Modal from '../../components/Modal/Modal'
import Member from '../../components/Member/Member'
import { toast } from 'sonner'
import { usePageTitle } from '../../hooks/usePageTitle'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8080'
const FAMILY_CODE_ENDPOINT =
  import.meta.env.VITE_FAMILY_CODE_ENDPOINT || `${BACKEND_URL}/families/code`
const FAMILY_JOIN_ENDPOINT =
  import.meta.env.VITE_FAMILY_JOIN_ENDPOINT || `${BACKEND_URL}/families/join`
const FAMILY_LEAVE_ENDPOINT =
  import.meta.env.VITE_FAMILY_LEAVE_ENDPOINT || `${BACKEND_URL}/families/leave`

export default function Profile() {
  usePageTitle('Mi Perfil - NutApp')
  const { user, profile } = useSupabaseAuth()
  const [newFamilyCode, setNewFamilyCode] = useState('')
  const [shareCode, setShareCode] = useState('')
  const [shareLoading, setShareLoading] = useState(false)
  const [shareError, setShareError] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [modalContent, setModalContent] = useState('share') // 'share' o 'join'
  // TODO: Reemplazar con datos reales de miembros de la familia
  const members = [
    {
      id: 1,
      name: 'Papá',
      image: 'https://blocks.astratic.com/img/user-img-small.png',
    },
    {
      id: 2,
      name: 'Mamá',
      image: 'https://blocks.astratic.com/img/user-img-small.png',
    },
  ]

  const modalRef = useRef(null)

  const identity = user?.identities?.[0]?.identity_data
  const sessionAvatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    identity?.avatar_url ||
    identity?.picture ||
    ''

  const sessionName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.given_name ||
    (user?.email ? user.email.split('@')[0] : '')

  const sessionEmail = user?.email || user?.user_metadata?.email || ''

  const userData = {
    name: profile?.name || sessionName,
    email: profile?.email || sessionEmail,
    familyCode:
      shareCode ||
      profile?.family_code ||
      profile?.data?.family_code ||
      profile?.familyId ||
      user?.user_metadata?.familyCode ||
      user?.user_metadata?.family_code ||
      user?.user_metadata?.family ||
      '',
    avatar: profile?.avatarUrl || sessionAvatar,
    profileId: profile?.profileId || null,
    familyId: profile?.familyId || null,
  }

  const persistSharedCode = (code) => {
    setShareCode(code)

    if (!profile || !user) return

    const cacheKey = `nutapp.profile:${user.id}`

    try {
      const cachedProfile = window.localStorage.getItem(cacheKey)
      if (!cachedProfile) return

      const parsedProfile = JSON.parse(cachedProfile)
      const nextProfile = {
        ...parsedProfile,
        familyCode: code,
        data: {
          ...(parsedProfile.data || {}),
          family_code: code,
        },
      }

      window.localStorage.setItem(cacheKey, JSON.stringify(nextProfile))
    } catch (error) {
      console.error('Error caching family code:', error.message)
    }
  }

  const joinFamily = async (code) => {
    setJoinLoading(true)
    setJoinError('')

    try {
      const resp = await fetch(FAMILY_JOIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          profile_id: profile?.profileId,
          google_id: user?.id,
        }),
      })

      if (!resp.ok) {
        const text = await resp.text().catch(() => '')
        throw new Error(text || `Backend join failed: ${resp.status}`)
      }

      const data = await resp.json()
      const generatedCode =
        data.family_code || data.code || data.data?.family_code
      const familyId = data.family_id || data.data?.family_id || null

      if (generatedCode) persistSharedCode(generatedCode)

      try {
        const cacheKey = `nutapp.profile:${user.id}`
        const cached = window.localStorage.getItem(cacheKey)
        if (cached) {
          const p = JSON.parse(cached)
          p.familyCode = generatedCode || p.familyCode
          p.familyId = familyId || p.familyId
          p.data = {
            ...(p.data || {}),
            family_code: generatedCode || p.data?.family_code,
          }
          window.localStorage.setItem(cacheKey, JSON.stringify(p))
        }
      } catch (e) {
        console.error(
          'Error updating cached profile after joining family:',
          e.message
        )
      }

      toast.success('Te uniste a la familia correctamente')
      modalRef.current.close()
      return true
    } catch (err) {
      const msg = err?.message || 'Error al unirse a la familia'
      setJoinError(msg)
      toast.error(msg)
      return false
    } finally {
      setJoinLoading(false)
    }
  }

  const leaveAndJoin = async (code) => {
    setJoinLoading(true)
    setJoinError('')
    try {
      if (profile?.familyId) {
        const leaveResp = await fetch(FAMILY_LEAVE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile_id: profile.profileId,
            family_id: profile.familyId,
          }),
        })

        if (!leaveResp.ok) {
          const text = await leaveResp.text().catch(() => '')
          throw new Error(text || `Backend leave failed: ${leaveResp.status}`)
        }
      }

      const ok = await joinFamily(code)
      return ok
    } catch (err) {
      const msg = err?.message || 'Error al salir y unirse a la nueva familia'
      setJoinError(msg)
      toast.error(msg)
      return false
    } finally {
      setJoinLoading(false)
    }
  }

  const requestFamilyCode = async () => {
    const currentCode = userData.familyCode
    if (currentCode) {
      setShareCode(currentCode)
      setShareError('')
      return currentCode
    }

    if (!profile?.profileId && !user?.id) {
      const msg = 'No se encontró información del perfil para generar el código'
      setShareError(msg)
      toast.error(msg)
      return ''
    }

    setShareLoading(true)
    setShareError('')

    try {
      const response = await fetch(FAMILY_CODE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: profile?.profileId,
          family_id: profile?.familyId,
          google_id: user?.id,
          name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar,
        }),
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new Error(
          text || `Backend responded with status ${response.status}`
        )
      }

      const data = await response.json()
      const generatedCode =
        data.family_code || data.code || data.data?.family_code

      if (!generatedCode) {
        throw new Error('El backend no devolvió un código de familia')
      }

      persistSharedCode(generatedCode)
      return generatedCode
    } catch (error) {
      const message = error.message || 'No se pudo generar el código de familia'
      setShareError(message)
      toast.error(message)
      return ''
    } finally {
      setShareLoading(false)
    }
  }

  const handleClickShare = async () => {
    setModalContent('share')
    modalRef.current?.showModal()

    const currentCode = userData.familyCode
    if (currentCode) {
      setShareCode(currentCode)
      setShareError('')
      return
    }

    await requestFamilyCode()
  }

  const handleConfirmLeaveAndJoin = async () => {
    const code = newFamilyCode.trim()
    if (!code) {
      setJoinError('Introduce un código válido')
      return
    }

    await leaveAndJoin(code)
  }
  const handleIconClick = async () => {
    try {
      const codeToCopy = userData.familyCode
      if (!codeToCopy) return

      await navigator.clipboard.writeText(codeToCopy)
      toast.success('Código de familia copiado al portapapeles')
    } catch {
      toast.error('No se pudo copiar el código')
    }
  }
  const handleClickJoin = () => {
    setModalContent('join')
    modalRef.current.showModal()
  }
  const handleJoinFamily = async () => {
    const code = newFamilyCode.trim()
    if (!code) {
      setJoinError('Introduce un código válido')
      return
    }

    if (userData.familyCode) {
      setModalContent('confirm-join')
      return
    }

    await joinFamily(code)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
      return
    }
    window.location.href = '/'
  }

  return (
    <main className={styles.content}>
      <section className={styles.profileHeader}>
        <div className={styles.imgProfileBackground}></div>
        <div className={styles.userImgHeader}>
          <img
            src={
              userData.avatar ||
              'https://blocks.astratic.com/img/user-img-small.png'
            }
            alt={userData.name || 'Usuario'}
          />
          <div className={styles.editIcon}>
            <Pencil size={16} />
          </div>

          <div className={styles.socialIcons}>
            <button
              onClick={handleClickJoin}
              aria-label="Follow"
              data-tooltip="Unirse a familia"
            >
              <Users />
            </button>
            <button
              onClick={handleClickShare}
              aria-label="Share"
              data-tooltip="Compartir código de familia"
            >
              <Share2 />
            </button>
          </div>
        </div>
      </section>
      <section className={styles.profileInfo}>
        <FormInput
          label="Nombre"
          type="text"
          inputName="name"
          value={userData.name}
          readOnly={true}
        />
        <FormInput
          label="E-mail"
          type="email"
          inputName="email"
          value={userData.email}
          readOnly={true}
        />
        {/* <FormInput
          label="Código de familia"
          type="text"
          inputName="familyCode"
          value={userData.familyCode}
          readOnly={true}
        /> */}
        <button className={styles.btnDanger} onClick={handleSignOut}>
          Cerrar sesión
        </button>
      </section>
      <Modal
        ref={modalRef}
        title={
          modalContent === 'share'
            ? 'Compartir código de familia'
            : 'Unirse a familia'
        }
      >
        {modalContent === 'share' ? (
          <div className={styles.modalContent}>
            <div className={styles.headerContainer}>
              <img
                src="https://blocks.astratic.com/img/general-img-landscape.png"
                alt="Imagen de familia"
              />
            </div>
            <div className={styles.modalBody}>
              <section className={styles.shareCode}>
                <h4>Compartir código</h4>
                {shareLoading ? (
                  <p>Generando código de familia...</p>
                ) : shareError ? (
                  <>
                    <p>{shareError}</p>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={requestFamilyCode}
                    >
                      Reintentar
                    </button>
                  </>
                ) : (
                  <FormInput
                    label="Código de familia"
                    type="text"
                    value={userData.familyCode}
                    readOnly={true}
                    Icon={Copy}
                    onIconClick={handleIconClick}
                    inputName="familyCode"
                  />
                )}
              </section>
              <section className={styles.familyMembers}>
                <h4>Miembros de la familia</h4>
                <hr />
                <div className={styles.memberList}>
                  {members.length > 0 ? (
                    members.map((member) => (
                      <Member
                        key={member.id}
                        name={member.name}
                        image={member.image}
                      />
                    ))
                  ) : (
                    <p>Comparte tu código de familia para agregar miembros.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        ) : modalContent === 'confirm-join' ? (
          <div className={styles.modalBody}>
            <p>
              Ya perteneces a una familia. ¿Estás seguro que deseas salir de tu
              familia actual y unirte a la nueva con código{' '}
              <strong>{newFamilyCode}</strong>?
            </p>
            {joinError && <p className={styles.errorText}>{joinError}</p>}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                className={styles.btnSecondary}
                onClick={() => setModalContent('join')}
                disabled={joinLoading}
              >
                Cancelar
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleConfirmLeaveAndJoin}
                disabled={joinLoading}
              >
                {joinLoading ? 'Procesando...' : 'Salir y unirme'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.modalBody}>
            <FormInput
              label="Ingresa el código de familia"
              type="text"
              value={newFamilyCode}
              onChange={(e) => setNewFamilyCode(e.target.value)}
              placeholder=" "
              inputName="joinFamilyCode"
            />
            {joinError && <p className={styles.errorText}>{joinError}</p>}
            <button
              className={styles.btnPrimary}
              onClick={handleJoinFamily}
              disabled={joinLoading}
            >
              {joinLoading ? 'Procesando...' : 'Unirse'}
            </button>
          </div>
        )}
      </Modal>
    </main>
  )
}
