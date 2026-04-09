import styles from './WeeklyDiet.module.css'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function WeeklyDiet() {
  usePageTitle('Dieta Semanal - NutApp')
  return (
    <main className={styles.container}>
      <h1>
        <span className={styles.highlight}>Dieta</span> Semanal
      </h1>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Día/Tiempo</th>
              <th>Desayuno</th>
              <th>Colación</th>
              <th>Comida</th>
              <th>Colación</th>
              <th>Cena</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lunes</td>
              <td>Huevos con pan</td>
              <td>Frutas</td>
              <td>Pollo con arroz</td>
              <td>Yogur</td>
              <td>Salmón con verduras</td>
            </tr>
            <tr>
              <td>Martes</td>
              <td>Avena con leche</td>
              <td>Nueces</td>
              <td>Pasta con tomate</td>
              <td>Manzana</td>
              <td>Pavo con papas</td>
            </tr>
            <tr>
              <td>Miércoles</td>
              <td>Tostadas con queso</td>
              <td>Banana</td>
              <td>Carne con patatas</td>
              <td>Almendras</td>
              <td>Filete con ensalada</td>
            </tr>
            <tr>
              <td>Jueves</td>
              <td>Pancakes</td>
              <td>Naranja</td>
              <td>Atún con verduras</td>
              <td>Queso fresco</td>
              <td>Pollo al horno con brócoli</td>
            </tr>
            <tr>
              <td>Viernes</td>
              <td>Cereal con leche</td>
              <td>Frutos secos</td>
              <td>Lentejas con arroz</td>
              <td>Pera</td>
              <td>Bacalao con batata</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
