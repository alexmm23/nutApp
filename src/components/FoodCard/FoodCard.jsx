import styles from './FoodCard.module.css'
export default function FoodCard({ time, name, image, id }) {
  return (
    <article className={styles['card']} id={id}>
      <img src={image} alt={name} />
      <div className={styles['card-content']}>
        <h3 className={styles['food-time']}>{time}</h3>
        <p className={styles['food-name']}>{name}</p>
      </div>
    </article>
  )
}
