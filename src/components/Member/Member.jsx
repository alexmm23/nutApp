import styles from './Member.module.css'

export default function Member({ name, image }) {
  return (
    <div className={styles['family-member']}>
      <img src={image} alt={name} />
      <p>{name}</p>
    </div>
  )
}
