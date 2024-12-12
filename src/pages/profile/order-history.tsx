import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderHistoryItem from '../../components/order-history-item/order-history-item';
import styles from './order-history.module.css';
import { RootState } from '../../services/store';
import {
  connect,
  disconnect,
} from '../../services/history-orders/history-orders-slice';
import { Ingredient } from '../../utils/types';

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.historyOrders.orders);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    dispatch(connect());

    return () => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  const handleOrderClick = (orderNumber: string) => {
    navigate(`/react-burger/profile/orders/${orderNumber}`, {
      state: { backgroundLocation: location },
    });
  };

  const getIngredientDetails = (ingredientIds: string[]): Ingredient[] => {
    return ingredientIds
      .map((id) => ingredients.find((ingredient) => ingredient._id === id))
      .filter(Boolean) as Ingredient[];
  };

  return (
    <div className={styles.orders}>
      {[...orders].reverse().map((order) => {
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
            status={order.status}
            onClick={() => handleOrderClick(order.number.toString())}
          />
        );
      })}
    </div>
  );
};

export default OrderHistoryPage;
