import {
  Menu,
  Feather,
  House,
  User,
  ShoppingBasket,
  LogOut,
} from 'lucide-react'
import DietIcon from './DietIcon.jsx'
import { useState } from 'react'
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuItems = [
    { name: 'Inicio', link: '#', icon: House },
    { name: 'Mi perfil', link: '#', icon: User },
    { name: 'Dieta Semanal', link: '#', icon: DietIcon },
    { name: 'Lista de compras', link: '#', icon: ShoppingBasket },
    { name: 'Cerrar sesión', link: '#', icon: LogOut },
  ]
  return (
    <header className={`header ${!isMenuOpen ? 'no-shadow' : ''}`}>
      <span className="logo">
        <Feather size={32} color="var(--bg-main)" />
      </span>
      <h1 className={isMenuOpen ? 'hide' : ''}>TU MENÚ DE HOY</h1>
      <span className="menu-icon-container">
        <Menu
          className="menu-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <nav className={`menu-container ${isMenuOpen ? 'is-open' : ''}`}>
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="menu-item"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <a href={item.link}>
                  <item.icon size={32} />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </span>
    </header>
  )
}
