import styles from './FormInput.module.css'
export default function FormInput({
  label,
  type,
  value,
  inputName,
  onChange = () => {},
  disabled = false,
  readOnly = false,
  Icon,
  onIconClick = () => {},
}) {
  return (
    <div className={styles.inputContainer}>
      <input
        id={inputName}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`${styles.input} ${Icon ? styles.inputWithIcon : ''}`}
        name={inputName}
        readOnly={readOnly}
        autoComplete={type === 'password' ? 'current-password' : 'off'}
        {...(disabled !== null && disabled !== undefined && { disabled })}
      />
      <label htmlFor={inputName} className={styles.label}>
        {label}
      </label>
      {Icon && (
        <button
          type="button"
          className={styles.iconButton}
          disabled={disabled}
          onClick={onIconClick}
          tabIndex="-1"
        >
          <Icon size={18} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
