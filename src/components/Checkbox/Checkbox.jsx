import styles from './Checkbox.module.css'

export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className={styles.container}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkmark}></span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
