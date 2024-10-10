import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import IngredientItem from './ingredient-item/ingredient-item';
import styles from './burger-ingredients.module.css';
import IngredientDetails from '../ingredient-details/ingredient-details';
import Modal from '../modal/modal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { Ingredient } from '../../utils/types';
import { fetchIngredients } from '../../services/ingredients-slice';
import { setCurrentIngredient, clearCurrentIngredient } from '../../services/current-ingredient-slice'; 


const BurgerIngredients: React.FC = () => {
  const [current, setCurrent] = useState('Булки');
  

  const dispatch = useDispatch<AppDispatch>();
  const { ingredients, status, error } = useSelector((state: RootState) => state.ingredients);
  const currentIngredient = useSelector((state: RootState) => state.currentIngredient.currentIngredient);

  const bunsRef = useRef<HTMLHeadingElement>(null);
  const saucesRef = useRef<HTMLHeadingElement>(null);
  const fillingsRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleIngredientClick = (ingredient: Ingredient) => {
    dispatch(setCurrentIngredient(ingredient));
  };

  const closeModal = () => {
    dispatch(clearCurrentIngredient());
  };


  const handleTabClick = useCallback((tab: string) => {
    setCurrent(tab);
    if (tab === 'Булки') {
      bunsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'Соусы') {
      saucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      fillingsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;
  
    const bunsTop = bunsRef.current?.getBoundingClientRect().top || 0;
    const saucesTop = saucesRef.current?.getBoundingClientRect().top || 0;
    const fillingsTop = fillingsRef.current?.getBoundingClientRect().top || 0;
  
 
    const bunsOffset = bunsTop - containerTop;
    const saucesOffset = saucesTop - containerTop;
    const fillingsOffset = fillingsTop - containerTop;
  
  
    if (bunsOffset < 100 && bunsOffset > -100) {
      setCurrent('Булки');
    } else if (saucesOffset < 100 && saucesOffset > -100) {
      setCurrent('Соусы');
    } else if (fillingsOffset < 100 && fillingsOffset > -100) {
      setCurrent('Начинки');
    }
  }, []);
  

  const { buns, sauces, fillings } = useMemo(() => {
    const categorized = { buns: [] as Ingredient[], sauces: [] as Ingredient[], fillings: [] as Ingredient[] };

    ingredients.forEach((item) => {
      if (item.type === 'bun') categorized.buns.push(item);
      else if (item.type === 'sauce') categorized.sauces.push(item);
      else categorized.fillings.push(item);
    });

    return categorized;
  }, [ingredients]);

 if (status === 'loading') {
    return <p>Загрузка ингредиентов...</p>;
  }

  if (status === 'failed') {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <section className={`${styles.container}`}>
      <div className={styles.tabs}>
        <Tab value="Булки" active={current === 'Булки'} onClick={() => handleTabClick('Булки')}>
          Булки
        </Tab>
        <Tab value="Соусы" active={current === 'Соусы'} onClick={() => handleTabClick('Соусы')}>
          Соусы
        </Tab>
        <Tab value="Начинки" active={current === 'Начинки'} onClick={() => handleTabClick('Начинки')}>
          Начинки
        </Tab>
      </div>

      <div className={`${styles.ingredientsContainer}`} ref={containerRef} onScroll={handleScroll}>
        <h2 ref={bunsRef} className="text text_type_main-medium pt-5 pb-5">
          Булки
        </h2>
        <div className={styles.ingredientsList}>
          {buns.map((item) => (
            <div onClick={() => handleIngredientClick(item)} key={item._id}>
              <IngredientItem item={item} />
            </div>
            ))}
        </div>

        <h2 ref={saucesRef} className="text text_type_main-medium pt-5 pb-5">
          Соусы
        </h2>
        <div className={styles.ingredientsList}>
        {sauces.map((item) => (
            <div onClick={() => handleIngredientClick(item)} key={item._id}>
              <IngredientItem item={item} />
            </div>
            ))}
        </div>

        <h2 ref={fillingsRef} className="text text_type_main-medium pt-5 pb-5">
          Начинки
        </h2>
        <div className={styles.ingredientsList}>
        {fillings.map((item) => (
            <div onClick={() => handleIngredientClick(item)} key={item._id}>
              <IngredientItem item={item} />
            </div>
            ))}
        </div>
      </div>

      {currentIngredient && (
        <Modal title="Детали ингредиента" onClose={closeModal}>
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
    </section>
  );
};

export default BurgerIngredients;
