import styles from './ShoppingList.module.css'
import Checkbox from '../../components/Checkbox/Checkbox'
import { useState } from 'react'

export default function ShoppingList() {
  const [checkedItems, setCheckedItems] = useState(new Set())
  const shoppingItems = [
    {
      id: 1,
      name: 'Leche',
      img: 'https://blocks.astratic.com/img/general-img-landscape.png',
      quantity: '2 litros',
      category: 'Lácteos',
    },
    {
      id: 2,
      img: 'https://blocks.astratic.com/img/general-img-landscape.png',
      name: 'Pan integral',
      quantity: '1 paquete',
      category: 'Panadería',
    },
  ]
  const groupedItems = shoppingItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})
  return (
    <main className={styles.container}>
      <h1>
        <span className={styles.highlight}>Lista</span> de Compras
      </h1>
      <section className={styles.listContainer}>
        <ul className={styles.categoryList}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <li key={category} className={styles.categoryItem}>
              <h2 className={styles.categoryTitle}>{category}</h2>
              <ul className={styles.itemsList}>
                {items.map((item) => (
                  <li key={item.id} className={styles.listItem}>
                    <Checkbox
                      checked={checkedItems.has(item.id)}
                      onChange={() => {
                        const newCheckedItems = new Set(checkedItems)
                        if (newCheckedItems.has(item.id)) {
                          newCheckedItems.delete(item.id)
                        } else {
                          newCheckedItems.add(item.id)
                        }
                        setCheckedItems(newCheckedItems)
                      }}
                    />
                    <img
                      src={item.img}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQuantity}>
                        {item.quantity}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
