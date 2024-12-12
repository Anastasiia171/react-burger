import React, { useMemo } from 'react';
import { RootState } from '../../../services/store';
import { useDrag } from 'react-dnd';
import styles from './ingredient-item.module.css';
import {
  CurrencyIcon,
  Counter,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../../utils/types';

import { incrementIngredientCount } from '../../../services/ingredients-slice/ingredients-slice';
import { useAppDispatch, useAppSelector } from '../../../services/hooks';

interface IngredientItemProps {
  item: Ingredient;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const [, dragRef] = useDrag(() => ({
    type: 'ingredient',
    item: { ...item },
    end: (draggedItem, monitor) => {
      if (monitor.didDrop()) {
        dispatch(incrementIngredientCount(item._id));
      }
    },
  }));

  const { bun, burgerIngredients } = useAppSelector(
    (state) => state.burgerConstructor,
  );

  const count = useMemo(() => {
    if (item.type === 'bun') {
      return bun && bun._id === item._id ? 2 : 0;
    } else {
      return burgerIngredients.filter(
        (ingredient) => ingredient._id === item._id,
      ).length;
    }
  }, [item, bun, burgerIngredients]);

  return (
    <div ref={dragRef} className={`${styles.item} pl-4 pr-4 mb-8`}>
      {count > 0 && <Counter count={count} size="default" />}
      <img className={`${styles.image}`} src={item.image} alt={item.name} />
      <div className={`${styles.price} mt=1 mb=1`}>
        <span className="text text_type_digits-default">{item.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <span className={`${styles.name} text text_type_main-default`}>
        {item.name}
      </span>
    </div>
  );
};

export default IngredientItem;
