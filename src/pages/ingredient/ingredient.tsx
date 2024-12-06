import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { RootState } from '../../services/store';
import IngredientDetails from '../../components/ingredient-details/ingredient-details';
import styles from './ingredient.module.css';

const IngredientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredient = useAppSelector((state) =>
    state.ingredients.ingredients.find((item) => item._id === id),
  );

  if (!ingredient) {
    return <p>Загрузка данных ингредиента...</p>;
  }

  return (
    <div className={styles.content}>
      <IngredientDetails ingredient={ingredient} />
    </div>
  );
};

export default IngredientPage;
