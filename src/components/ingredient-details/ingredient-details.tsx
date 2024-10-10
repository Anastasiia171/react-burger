import React from 'react';
import styles from './ingredient-details.module.css';
import { Ingredient } from '../../utils/types';


interface IngredientDetailsProps {
    ingredient: Ingredient;
}

const IngredientDetails: React.FC<IngredientDetailsProps> = ({ ingredient }) => {
    return (
        <div className={styles.container}>
            <img src={ingredient.image_large} alt={ingredient.name} className={styles.image} />

       
            <h3 className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</h3>

            <div className={`${styles.nutrition} mt-8 mb-8`}>
       
                <div className="text text_type_main-default text_color_inactive">
                    <p className="mb-2">Калории,ккал</p>
                    <p className="text text_type_digits-default">{ingredient.calories}</p>
                </div>
                <div className="text text_type_main-default text_color_inactive">
                    <p className="mb-2">Белки, г</p>
                    <p className="text text_type_digits-default">{ingredient.proteins}</p>
                </div>
                <div className="text text_type_main-default text_color_inactive">
                    <p className="mb-2">Жиры, г</p>
                    <p className="text text_type_digits-default">{ingredient.fat}</p>
                </div>
                <div className="text text_type_main-default text_color_inactive">
                    <p className="mb-2">Углеводы, г</p>
                    <p className="text text_type_digits-default">{ingredient.carbohydrates}</p>
                </div>
            </div>
        </div>
    );
};

export default IngredientDetails;
