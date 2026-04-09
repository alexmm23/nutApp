import { forwardRef, useImperativeHandle, useState } from 'react'
import styles from './Modal.module.css'
import { X } from 'lucide-react'

const Modal = forwardRef(({ title, children }, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    showModal: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }))

  const closeModal = () => {
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={closeModal}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>{title}</h3>
          <button onClick={closeModal} className={styles.closeButton}>
            <X />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
})

export default Modal
