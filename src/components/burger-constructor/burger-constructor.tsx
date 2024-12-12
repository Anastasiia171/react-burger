import React, { useMemo, useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import {
  Button,
  CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import BurgerConstructorItem from './burger-constructor-item/burger-constructor-item';
import Modal from '../modal/modal';
import OrderDetails from '../order-details/order-details';

import { RootState } from '../../services/store';
import { placeOrder, clearOrder } from '../../services/order-slice/order-slice';
import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../../services/burger-constructor/burger-constructor-slice';
import { decrementIngredientCount } from '../../services/ingredients-slice/ingredients-slice';
import { Ingredient } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../utils/auth-tokens';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import Loader from '../loader/loader';

const BurgerConstructor: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { bun, burgerIngredients } = useAppSelector(
    (state) => state.burgerConstructor,
  );
  const token = getAccessToken();

  const moveIngredientHandler = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(moveIngredient({ dragIndex, hoverIndex }));
    },
    [dispatch],
  );

  const [{ isOver }, dropRef] = useDrop({
    accept: 'ingredient',
    drop: (item: Ingredient & { uniqueId?: string }) => {
      const isAlreadyInConstructor = item.uniqueId !== undefined;
      if (!isAlreadyInConstructor) {
        dispatch(addIngredient(item));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleOpenModal = () => {
    if (!token) {
      navigate('/react-burger/login');
      return;
    }

    const ingredientIds = [...burgerIngredients.map((item) => item._id)];
    if (bun) {
      ingredientIds.push(bun._id);
      ingredientIds.unshift(bun._id);
    }

    setLoading(true);

    dispatch(placeOrder(ingredientIds))
      .unwrap()
      .then(() => setModalOpen(true))
      .catch((error) => console.error('Ошибка при оформлении заказа:', error))
      .finally(() => setLoading(false));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const handleRemoveIngredient = (
    uniqueId: string | undefined,
    _id: string,
  ) => {
    if (uniqueId) {
      dispatch(removeIngredient(uniqueId));
      dispatch(decrementIngredientCount(_id));
    }
  };

  const totalPrice = useMemo(() => {
    return (
      (bun ? bun.price * 2 : 0) +
      burgerIngredients.reduce((acc, item) => acc + item.price, 0)
    );
  }, [bun, burgerIngredients]);

  return (
    <section
      ref={dropRef}
      className={`${styles.constructorContainer} ${isOver ? styles.isOver : ''}`}
      data-cy="constructor"
    >
      {bun && (
        <BurgerConstructorItem
          item={bun}
          isLocked={true}
          type="top"
          className="ml-6 mb-4"
          data-cy="bun-top"
        />
      )}

      <div
        className={styles.ingredientsContainer}
        data-cy="ingredients-container"
      >
        {burgerIngredients.map((item, index) => (
          <BurgerConstructorItem
            key={item.uniqueId}
            index={index}
            item={item}
            moveIngredient={moveIngredientHandler}
            handleRemove={() => handleRemoveIngredient(item.uniqueId, item._id)}
            data-cy={`ingredient-${item._id}`}
          />
        ))}
      </div>

      {bun && (
        <BurgerConstructorItem
          item={bun}
          isLocked={true}
          type="bottom"
          className="ml-6 mt-4"
          data-cy="bun-bottom"
        />
      )}

      <div className={`${styles.footer} pt-4 pb-4`} data-cy="footer">
        <div className={styles.totalPrice} data-cy="total-price">
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          type="primary"
          size="medium"
          htmlType="button"
          onClick={handleOpenModal}
          disabled={!bun}
          data-cy="order-button"
        >
          Оформить заказ
        </Button>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}

      {isLoading && <Loader data-cy="loader" />}
    </section>
  );
};

export default BurgerConstructor;
