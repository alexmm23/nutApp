import styles from './FamilyCarrousel.module.css'
import Member from '../Member/Member'

export default function FamilyCarrousel({ members, title }) {
  return (
    <section className={styles['family-carrousel']}>
      <span className={styles['chip']}>{title}</span>
      <div className={styles['family-members']}>
        {members.map((member) => (
          <Member key={member.id} name={member.name} image={member.image} />
        ))}
      </div>
    </section>
  )
}
