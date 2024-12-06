import React from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './order-history-ingredient-item.module.css';


interface OrderHistoryIngredientItemProps {
    image: string;
    name: string;
    quantity: number;
    price: number;
}

const OrderHistoryIngredientItem: React.FC<OrderHistoryIngredientItemProps> = ({  image, name, quantity, price }) => {
return (
    <div className={styles.wrapper}>
    <div className={styles.ingredient}>
    <img src={image} alt={name} className={styles.image} />
    <span className="text text_type_main-default">{name}</span>
    </div>
    <div className={styles.price}>
    <span className="text text_type_digits-default">{quantity} x {price}</span>
    <CurrencyIcon type="primary" />
    </div>
    </div>
    );
};

export default OrderHistoryIngredientItem;