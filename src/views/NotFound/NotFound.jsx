import { Link } from 'react-router-dom'
import { SearchX, ArrowLeft } from 'lucide-react'
import styles from './NotFound.module.css'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Página no encontrada - NutApp')
  return (
    <main className={styles['not-found-container']}>
      <SearchX size={64} color="var(--bg-main)" />
      <h1>404</h1>
      <p>Parece que este plato no está en el menú</p>
      <Link to="/" className={styles['btn-back-home']}>
        <ArrowLeft size={24} />
        Volver al menú
      </Link>
    </main>
  )
}
