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

export default function Profile() {
  usePageTitle('Mi Perfil - NutApp')
  const { user, profile } = useSupabaseAuth()
  const [newFamilyCode, setNewFamilyCode] = useState('')
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
      profile?.familyCode ||
      profile?.family_code ||
      profile?.familyId ||
      user?.user_metadata?.familyCode ||
      user?.user_metadata?.family_code ||
      user?.user_metadata?.family ||
      '',
    avatar: profile?.avatarUrl || sessionAvatar,
    profileId: profile?.profileId || null,
    familyId: profile?.familyId || null,
  }

  const handleClickShare = () => {
    setModalContent('share')
    modalRef.current.showModal()
  }
  const handleIconClick = async () => {
    try {
      await navigator.clipboard.writeText(userData.familyCode)
      toast.success('Código de familia copiado al portapapeles')
    } catch {
      toast.error('No se pudo copiar el código')
    }
  }
  const handleClickJoin = () => {
    setModalContent('join')
    modalRef.current.showModal()
  }
  const handleJoinFamily = () => {
    console.log('Código de familia ingresado:', newFamilyCode)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
      return
    }
    // optional: reload or navigate to home
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
        <FormInput
          label="Código de familia"
          type="text"
          inputName="familyCode"
          value={userData.familyCode}
          readOnly={true}
        />
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
                <FormInput
                  label="Código de familia"
                  type="text"
                  value={userData.familyCode}
                  readOnly={true}
                  Icon={Copy}
                  onIconClick={handleIconClick}
                  inputName="familyCode"
                />
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
            <button className={styles.btnPrimary} onClick={handleJoinFamily}>
              Unirse
            </button>
          </div>
        )}
      </Modal>
    </main>
  )
}
