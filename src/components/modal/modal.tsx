import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './modal.module.css';
import ModalOverlay from '../modal-overlay/modal-overlay';

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const modalRoot = document.getElementById('modals') as HTMLElement;

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEscClose = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <>
      <div className={styles.modal} data-cy="modal">
        <div className={styles.contentWrapper}>
          <div
            className={styles.closeIcon}
            onClick={onClose}
            data-cy="modal-close-button"
          >
            <CloseIcon type="primary" />
          </div>
          <div className={`${styles.content}`}>{children}</div>
        </div>
      </div>

      <ModalOverlay onClose={onClose} />
    </>,
    modalRoot,
  );
};

export default Modal;
