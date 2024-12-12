import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderHistoryItem from '../../components/order-history-item/order-history-item';
import styles from './feed.module.css';
import { RootState } from '../../services/store';
import {
  connect,
  disconnect,
} from '../../services/feed-orders/feed-orders-slice';
import { fetchIngredients } from '../../services/ingredients-slice/ingredients-slice';
import { Ingredient, Order } from '../../utils/types';
import { Status } from '../../utils/statusEnum';

const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {
    orders = [],
    total,
    totalToday,
  } = useAppSelector((state) => state.feedOrders);
  const { ingredients, status, error } = useAppSelector(
    (state) => state.ingredients,
  );

  useEffect(() => {
    dispatch(connect());

    return () => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  const handleOrderClick = (order: Order) => {
    navigate(`/react-burger/feed/${order.number}`, {
      state: { order, backgroundLocation: location },
    });
  };

  const getIngredientDetails = (ingredientIds: string[]): Ingredient[] => {
    return ingredientIds
      .map((id) => ingredients.find((ingredient) => ingredient._id === id))
      .filter(Boolean) as Ingredient[];
  };

  if (status === Status.Loading) {
    return <div>Loading...</div>;
  }

  if (status === Status.Failed) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h1 className={`text text_type_main-large mb-5 mt-8`}>Лента заказов</h1>
      <div className={styles.wrapper}>
        <div className={styles.orders}>
          {orders.map((order) => {
            const orderIngredients = getIngredientDetails(order.ingredients);
            const totalPrice = orderIngredients.reduce(
              (sum, ingredient) => sum + ingredient.price,
              0,
            );

            return (
              <OrderHistoryItem
                key={order._id}
                orderNumber={order.number.toString()}
                date={order.updatedAt}
                name={`Order ${order.number}`}
                ingredients={orderIngredients}
                totalPrice={totalPrice}
                onClick={() => handleOrderClick(order)}
              />
            );
          })}
        </div>
        <div className={styles.stats}>
          <div className={styles.status}>
            <div>
              <h2 className={`${styles.name} text_type_main-medium`}>
                Готовы:
              </h2>
              {orders
                .filter((order) => order.status === 'done')
                .slice(0, 10)
                .map((order) => (
                  <div
                    key={order._id}
                    className={`text text_type_digits-default pb-2 ${styles.ready}`}
                  >
                    {order.number}
                  </div>
                ))}
            </div>
            <div>
              <h2 className={`${styles.name} text_type_main-medium`}>
                В работе:
              </h2>
              {orders
                .filter((order) => order.status === 'pending')
                .slice(0, 10)
                .map((order) => (
                  <div
                    key={order._id}
                    className="text text_type_digits-default pb-2"
                  >
                    {order.number}
                  </div>
                ))}
            </div>
          </div>

          <h2 className="text text_type_main-medium">
            Выполнено за все время:
          </h2>
          <span className={`text text_type_digits-large ${styles.total}`}>
            {total}
          </span>

          <h2 className="text text_type_main-medium mt-20">
            Выполнено за сегодня:
          </h2>
          <span className={`text text_type_digits-large ${styles.totalToday}`}>
            {totalToday}
          </span>
        </div>
      </div>
    </>
  );
};

export default FeedPage;
