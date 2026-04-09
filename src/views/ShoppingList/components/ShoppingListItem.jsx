import styles from '../ShoppIngList.module.css'
import Checkbox from '../../../components/Checkbox/Checkbox'

export default function ShoppingListItem({ item, checked, onToggle }) {
  return (
    <li className={styles.listItem}>
      <Checkbox checked={checked} onChange={onToggle} />
      <img src={item.img} alt={item.name} className={styles.itemImage} />
      <div className={styles.itemDetails}>
        <span className={styles.itemName}>{item.name}</span>
        <span className={styles.itemQuantity}>{item.quantity}</span>
      </div>
    </li>
  )
}
