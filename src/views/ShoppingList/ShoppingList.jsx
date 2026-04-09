import { useState } from 'react'
import styles from './ShoppingList.module.css'
import ShoppingCategory from './components/ShoppingCategory'

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

function groupItemsByCategory(items) {
  return items.reduce((accumulator, item) => {
    if (!accumulator[item.category]) {
      accumulator[item.category] = []
    }

    accumulator[item.category].push(item)
    return accumulator
  }, {})
}

export default function ShoppingList() {
  const [checkedItems, setCheckedItems] = useState(new Set())
  const groupedItems = groupItemsByCategory(shoppingItems)

  const handleToggleItem = (itemId) => {
    setCheckedItems((currentCheckedItems) => {
      const nextCheckedItems = new Set(currentCheckedItems)

      if (nextCheckedItems.has(itemId)) {
        nextCheckedItems.delete(itemId)
      } else {
        nextCheckedItems.add(itemId)
      }

      return nextCheckedItems
    })
  }

  return (
    <main className={styles.container}>
      <h1>
        <span className={styles.highlight}>Lista</span> de Compras
      </h1>
      <section className={styles.listContainer}>
        <ul className={styles.categoryList}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <ShoppingCategory
              key={category}
              category={category}
              items={items}
              checkedItems={checkedItems}
              onToggleItem={handleToggleItem}
            />
          ))}
        </ul>
      </section>
    </main>
  )
}
