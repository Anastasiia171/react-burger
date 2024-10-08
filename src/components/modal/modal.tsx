import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './modal.module.css'; 
import ModalOverlay from '../modal-overlay/modal-overlay';


interface ModalProps {
    title?: string
    onClose: () => void
    children: React.ReactNode
}

const modalRoot = document.getElementById('modals') as HTMLElement; 

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  
    useEffect(() => {
        const handleEscClose = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        };

        document.addEventListener('keydown', handleEscClose);
        return () => {
            document.removeEventListener('keydown', handleEscClose);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <>
            <div className={styles.modal}>
                <div className={`${styles.header} ml-10 mt-10 mr-10`}>
                    <h2 className="text text_type_main-large">{title}</h2>
                    <div className={styles.closeIcon} onClick={onClose}>
                        <CloseIcon type="primary" />
                    </div>
                </div>
                <div className={`${styles.content} p-4`}>
                    {children}
                </div>
            </div>
            <ModalOverlay onClose={onClose} />
        </>,
        modalRoot
    );
};

export default Modal;