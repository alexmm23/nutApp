import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import FoodCard from '../../components/FoodCard/FoodCard'
import styles from './Home.module.css'
import { Upload } from 'lucide-react'
import FamilyCarrousel from '../../components/FamilyCarrousel/FamilyCarrousel'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function Home() {
  usePageTitle('NutApp - Nutrición en Familia')
  const [floatingOffset, setFloatingOffset] = useState(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    const updateOffset = () => {
      const footer = document.querySelector('footer')
      if (!footer) {
        setFloatingOffset(0)
        return
      }

      const rect = footer.getBoundingClientRect()
      const overlap = Math.max(0, window.innerHeight - rect.top)
      const margin = 8 // extra spacing between button and footer
      setFloatingOffset(overlap ? Math.ceil(overlap + margin) : 0)
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          updateOffset()
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    // update once on mount
    updateOffset()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <main className={styles['home-content']}>
      {/* <h1 className={styles['head-text']}>NutApp</h1> */}
      <FoodCard
        time="Comida"
        name="Caldo de pollo"
        image="https://blocks.astratic.com/img/general-img-landscape.png"
        id="currentFood"
      />

      <FoodCard
        time="Próxima Comida"
        name="Ensalada César"
        image="https://blocks.astratic.com/img/general-img-landscape.png"
        id="nextFood"
      />

      <FamilyCarrousel
        title="Familia"
        members={[
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
          {
            id: 3,
            name: 'Hijo',
            image: 'https://blocks.astratic.com/img/user-img-small.png',
          },
          {
            id: 4,
            name: 'Hija',
            image: 'https://blocks.astratic.com/img/user-img-small.png',
          },
        ]}
      />

      <button className={styles['weekly-menu-button']}>
        <Link to="/weekly-diet">Ver el menú completo</Link>
      </button>

      <button
        className={styles['upload-button']}
        style={{ ['--floating-offset']: `${floatingOffset}px` }}
        aria-label="Subir"
      >
        <Upload size={25} />
      </button>
    </main>
  )
}
