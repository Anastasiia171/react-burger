import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import cn from 'clsx';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { getOrder } from '../../services/order-slice/order-slice';
import styles from './order-details.module.css';
import {
  CurrencyIcon,
  FormattedDate,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../utils/types';
import OrderHistoryIngredientItem from '../../components/order-history-ingredient-item/order-history-ingredient-item';

const OrderDetailsPage = ({ className }: { className?: string }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.order.order);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (id) {
      dispatch(getOrder(id));
    }
  }, [id, dispatch]);

  if (!order) {
    return <div>Заказ не найден. Выполните вход в аккаунт</div>;
  }

  const ingredientMap = order.ingredients.reduce((map, id) => {
    const ingredient = ingredients.find((ingredient) => ingredient._id === id);
    if (ingredient) {
      if (map.has(id)) {
        map.get(id)!.quantity += 1;
      } else {
        map.set(id, { ingredient, quantity: 1 });
      }
    }
    return map;
  }, new Map<string, { ingredient: Ingredient; quantity: number }>());

  const totalPrice = Array.from(ingredientMap.values()).reduce(
    (total, { ingredient, quantity }) => {
      const isBun = ingredient.type === 'bun';
      return total + ingredient.price * (isBun ? 2 : quantity);
    },
    0,
  );

  const statusText =
    {
      done: 'Выполнен',
      pending: 'Готовится',
      canceled: 'Отменен',
    }[order.status] || 'Неизвестен';

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.header}>
        <h1>#{order.number}</h1>
      </div>

      <div className={styles.info}>
        <h2 className="text text_type_main-medium">{order.name}</h2>
        <span
          className={`${styles.status} text text_type_main-default text_color_success`}
        >
          {statusText}
        </span>
      </div>

      <h3>Состав:</h3>
      <div className={styles.ingredients}>
        {Array.from(ingredientMap.values()).map(({ ingredient, quantity }) => (
          <OrderHistoryIngredientItem
            key={ingredient._id}
            image={ingredient.image}
            name={ingredient.name}
            quantity={ingredient.type === 'bun' ? 2 : quantity}
            price={ingredient.price}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
        <div className={styles.total}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
