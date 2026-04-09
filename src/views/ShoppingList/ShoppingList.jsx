import styles from './ShoppingList.module.css'

export default function ShoppingList() {
  return (
    <main className={styles.container}>
      <h1>
        <span className={styles.highlight}>Lista</span> de Compras
      </h1>
      <p>
        Esta sección está en construcción. ¡Pronto podrás ver tu lista de
        compras aquí!
      </p>
    </main>
  )
}
