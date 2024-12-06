import React from 'react';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../utils/types';
import styles from './order-history-item.module.css';

interface OrderHistoryItemProps {
  orderNumber: string;
  date: string;
  name: string;
  ingredients: Ingredient[];
  totalPrice: number;
  status?: string;
  onClick: () => void;
}

const getStatusText = (status: string): string => {
  switch (status) {
    case 'done':
      return 'Выполнен';
    case 'pending':
      return 'Готовится';
    case 'cancelled':
      return 'Отменён';
    default:
      return 'Неизвестно';
  }
};

const OrderHistoryItem: React.FC<OrderHistoryItemProps> = ({ orderNumber, date, name, ingredients, totalPrice, status, onClick }) => {
  const maxVisibleIngredients = 5;
  const visibleIngredients = ingredients.slice(0, maxVisibleIngredients).reverse();

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.header}>
        <span className="text text_type_digits-default">#{orderNumber}</span>
        <FormattedDate className="text text_type_main-default text_color_inactive" date={new Date(date)} />
      </div>
      <span className="text text_type_main-medium">{name}</span>
      {status && <span className="text text_type_main-default">{getStatusText(status)}</span>}
      <div className={styles.details}>
        <div className={styles.ingredients}>
          {visibleIngredients.map((ingredient, index) => (
            <div key={ingredient._id + index + Math.random()} className={styles.ingredient}>
              <img src={ingredient.image} alt={ingredient.name} className={styles.ingredientImage} />
              {index === 0 && ingredients.length > maxVisibleIngredients && (
                <div className={styles.counter}>
                  <span className="text text_type_digits-default">+{ingredients.length - maxVisibleIngredients}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
