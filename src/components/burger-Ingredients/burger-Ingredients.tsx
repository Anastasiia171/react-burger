import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import IngredientItem from './ingredient-item/ingredient-item';
import styles from './burger-ingredients.module.css';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { Ingredient } from '../../utils/types';
import {
  setCurrentIngredient,
  clearCurrentIngredient,
} from '../../services/current-ingredient/current-ingredient-slice';

const BurgerIngredients: React.FC = () => {
  const [current, setCurrent] = useState('Булки');
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { ingredients, status, error } = useAppSelector(
    (state) => state.ingredients,
  );

  const bunsRef = useRef<HTMLHeadingElement>(null);
  const saucesRef = useRef<HTMLHeadingElement>(null);
  const fillingsRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIngredientClick = (ingredient: Ingredient) => {
    dispatch(setCurrentIngredient(ingredient));
    navigate(`/react-burger/ingredients/${ingredient._id}`, {
      state: { backgroundLocation: location },
    });
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
    const categorized = {
      buns: [] as Ingredient[],
      sauces: [] as Ingredient[],
      fillings: [] as Ingredient[],
    };

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
        <Tab
          value="Булки"
          active={current === 'Булки'}
          onClick={() => handleTabClick('Булки')}
        >
          Булки
        </Tab>
        <Tab
          value="Соусы"
          active={current === 'Соусы'}
          onClick={() => handleTabClick('Соусы')}
        >
          Соусы
        </Tab>
        <Tab
          value="Начинки"
          active={current === 'Начинки'}
          onClick={() => handleTabClick('Начинки')}
        >
          Начинки
        </Tab>
      </div>

      <div
        className={`${styles.ingredientsContainer}`}
        ref={containerRef}
        onScroll={handleScroll}
      >
        <h2 ref={bunsRef} className="text text_type_main-medium pt-5 pb-5">
          Булки
        </h2>
        <div className={styles.ingredientsList}>
          {buns.map((item) => (
            <div
              data-cy={`ingredient-${item._id}`}
              onClick={() => handleIngredientClick(item)}
              key={item._id}
            >
              <IngredientItem item={item} />
            </div>
          ))}
        </div>

        <h2 ref={saucesRef} className="text text_type_main-medium pt-5 pb-5">
          Соусы
        </h2>
        <div className={styles.ingredientsList}>
          {sauces.map((item) => (
            <div
              data-cy={`ingredient-${item._id}`}
              onClick={() => handleIngredientClick(item)}
              key={item._id}
            >
              <IngredientItem item={item} />
            </div>
          ))}
        </div>

        <h2 ref={fillingsRef} className="text text_type_main-medium pt-5 pb-5">
          Начинки
        </h2>
        <div className={styles.ingredientsList}>
          {fillings.map((item) => (
            <div
              data-cy={`ingredient-${item._id}`}
              onClick={() => handleIngredientClick(item)}
              key={item._id}
            >
              <IngredientItem item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BurgerIngredients;
