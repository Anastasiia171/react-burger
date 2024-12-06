import React from 'react';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-details.module.css';
import { useAppSelector } from '../../services/hooks';
import { RootState } from '../../services/store';

const OrderDetails: React.FC = () => {
  const { order, status } = useAppSelector((state) => state.order);

  if (status === 'loading') {
    return <p>Оформление заказа...</p>;
  }

  if (!order) {
    return null;
  }

  return (
    <div className={styles.container}>
      <p className="text text_type_digits-large">{order.number}</p>
      <p className="text text_type_main-medium pt-8">идентификатор заказа</p>

      <div className={`${styles.icon} pt-15 pb-15`}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className="text text_type_main-default pb-2">
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive mb-8">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetails;
