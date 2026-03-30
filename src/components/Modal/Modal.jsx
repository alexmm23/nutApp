import { forwardRef } from 'react'
import styles from './Modal.module.css'
import { X } from 'lucide-react'

const Modal = forwardRef(({ title, children }, ref) => {
  const closeModal = () => {
    ref.current.close()
  }
  return (
    <dialog ref={ref} className={styles.modal}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <button onClick={closeModal} className={styles.closeButton}>
          <X />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </dialog>
  )
})

export default Modal
