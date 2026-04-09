import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Feather, House, User, Calendar, Apple } from 'lucide-react'
import styles from './Header.module.css' // Importación del módulo
import DietIcon from '../DietIcon/DietIcon'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Inicio', link: '/', icon: House },
    { name: 'Mi perfil', link: '/perfil', icon: User },
    { name: 'Dieta Semanal', link: '/weekly-diet', icon: DietIcon },
    { name: 'Lista de compras', link: '/shopping-list', icon: Calendar },
    { name: 'Cerrar sesión', link: '/logout', icon: User },
  ]

  return (
    <header className={`${styles.header} ${isMenuOpen ? styles.noShadow : ''}`}>
      <span className={styles.logo}>
        <Feather size={32} color="var(--bg-main)" />
      </span>

      <h1 className={styles.title}>TU MENÚ DE HOY</h1>

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
                <NavLink
                  to={item.link}
                  className={styles.menuLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={24} />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
