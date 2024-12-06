import React from 'react';
import styles from './loader.module.css';

const Loader: React.FC = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
