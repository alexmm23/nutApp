import styles from '../ShoppIngList.module.css'
import ShoppingListItem from './ShoppingListItem'

export default function ShoppingCategory({
  category,
  items,
  checkedItems,
  onToggleItem,
}) {
  return (
    <li className={styles.categoryItem}>
      <h2 className={styles.categoryTitle}>{category}</h2>
      <ul className={styles.itemsList}>
        {items.map((item) => (
          <ShoppingListItem
            key={item.id}
            item={item}
            checked={checkedItems.has(item.id)}
            onToggle={() => onToggleItem(item.id)}
          />
        ))}
      </ul>
    </li>
  )
}
