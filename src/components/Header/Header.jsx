import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Feather, House, User, Calendar } from 'lucide-react'
import styles from './Header.module.css' // Importación del módulo
import Auth from '../Auth/Auth'
import DietIcon from '../DietIcon/DietIcon'
import useSupabaseAuth from '../../hooks/useSupabaseAuth'
import { supabase } from '../../lib/supabaseClient'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useSupabaseAuth()

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [isMenuOpen])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
      return
    }
    setIsMenuOpen(false)
  }

  const menuItems = [
    { name: 'Inicio', link: '/', icon: House },
    { name: 'Mi perfil', link: '/perfil', icon: User },
    { name: 'Dieta Semanal', link: '/weekly-diet', icon: DietIcon },
    { name: 'Lista de compras', link: '/shopping-list', icon: Calendar },
    ...(user
      ? [
          {
            name: 'Cerrar sesión',
            icon: User,
            action: signOut,
          },
        ]
      : []),
  ]

  return (
    <header className={`${styles.header} ${isMenuOpen ? styles.noShadow : ''}`}>
      <NavLink to="/" className={styles.logo} aria-label="Ir a inicio">
        <Feather size={32} color="var(--bg-main)" />
      </NavLink>

      <h1 className={styles.title}>TU MENÚ DE HOY</h1>

      <div className={styles.rightContainer}>
        <Auth />
        <div className={styles.menuIconContainer}>
          <Menu
            className={styles.menuIcon}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          <nav
            className={`${styles.menuContainer} ${isMenuOpen ? styles.isOpen : ''}`}
          >
            <ul className={styles.menuList}>
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={styles.menuItem}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 0.1}s` : '0s',
                  }}
                >
                  {item.link ? (
                    <NavLink
                      to={item.link}
                      className={styles.menuLink}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={24} />
                      {item.name}
                    </NavLink>
                  ) : (
                    <button
                      type="button"
                      className={styles.menuButton}
                      onClick={item.action}
                    >
                      <item.icon size={24} />
                      {item.name}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
