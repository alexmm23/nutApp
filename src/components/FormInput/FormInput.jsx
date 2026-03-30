import { Pencil } from 'lucide-react'
import styles from './FormInput.module.css'
export default function FormInput({ label, type, value, inputName, onChange }) {
  return (
    <div className={styles.inputContainer}>
      <input
        id={inputName}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={styles.input}
        name={inputName}
        readOnly={type === 'password'}
        autoComplete
        disabled={type === 'password'}
      />
      <label htmlFor={inputName} className={styles.label}>
        {label}
      </label>
    </div>
  )
}
