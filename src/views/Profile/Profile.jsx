import { Users, Share2, Pencil } from 'lucide-react'
import styles from './Profile.module.css'
import { useState } from 'react'
import FormInput from '../../components/FormInput/FormInput'
export default function Profile() {
  const [userData, setUserData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
  })

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
            <div role="button" aria-label="Follow">
              <Users />
            </div>
            <div role="button" aria-label="Share">
              <Share2 />
            </div>
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
    </main>
  )
}
