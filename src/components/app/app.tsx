import React from 'react';
import { DndProvider } from 'react-dnd'; 
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppHeader from '../app-header/app-header';
import BurgerIngredients from '../burger-Ingredients/burger-Ingredients';
import BurgerConstructor from '../burger-constructor/burger-constructor';
import styles from './app.module.css';

function App() {
  
return (
  <DndProvider backend={HTML5Backend}>
    <div className={styles.wrapper}>
      <AppHeader />
      <div className={styles.headerWrapper}>
      </div>
      <main>
        <h1 className={`text text_type_main-large mb-5 mt-8`}>Соберите бургер</h1>
        <div className={`${styles.content} mt-20`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </div>
      </main>
    </div>
    </DndProvider>
  );
}

export default App;
