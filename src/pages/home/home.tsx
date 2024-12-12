import React from 'react';

import styles from './home.module.css';
import BurgerIngredients from '../../components/burger-Ingredients/burger-Ingredients';
import BurgerConstructor from '../../components/burger-constructor/burger-constructor';

const HomePage: React.FC = () => {
  return (
    <>
      <h1 className={`text text_type_main-large mb-5 mt-8`}>Соберите бургер</h1>
      <div className={`${styles.content} mt-20`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </>
  );
};

export default HomePage;
