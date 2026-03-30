import { Users, Share2, Pencil, Copy } from 'lucide-react'
import styles from './Profile.module.css'
import { useState, useRef } from 'react'
import FormInput from '../../components/FormInput/FormInput'
import Modal from '../../components/Modal/Modal'
import Member from '../../components/Member/Member'
export default function Profile() {
  //TODO: Reemplazar con datos reales del usuario
  const [userData, setUserData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    familyCode: 'ABC123',
  })
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

  const handleClickShare = () => {
    setModalContent('share')
    modalRef.current.showModal()
  }
  const handleIconClick = () => {
    navigator.clipboard.writeText(userData.familyCode)
  }
  const handleClickJoin = () => {
    setModalContent('join')
    modalRef.current.showModal()
  }
  const handleJoinFamily = () => {
    console.log('Código de familia ingresado:', newFamilyCode)
  }

  return (
    <main className={styles.content}>
      <section className={styles.profileHeader}>
        <div className={styles.imgProfileBackground}></div>
        <div className={styles.userImgHeader}>
          <img
            src="https://blocks.astratic.com/img/user-img-small.png"
            alt="user profile image"
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
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <FormInput
          label="E-mail"
          type="email"
          inputName="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <FormInput
          label="Contraseña"
          type="password"
          inputName="password"
          value="********"
          onChange={() => {}}
          disabled="true"
        />
        <button className={styles.btnDanger}>Cerrar sesión</button>
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
