import { Link } from 'react-router-dom'
import FoodCard from '../../components/FoodCard/FoodCard'
import styles from './Home.module.css'
import { Upload } from 'lucide-react'
import FamilyCarrousel from '../../components/FamilyCarrousel/FamilyCarrousel'
export default function Home() {
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

      <section>
        <Link to="/weekly-diet">Ver el menú completo</Link>
      </section>

      <button>
        <Upload size={24} />
      </button>
    </main>
  )
}
