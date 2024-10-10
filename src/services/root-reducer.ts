import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients-slice';
import BurgerConstructorSlice from './burger-constructor-slice';
import currentIngredientReducer from './current-ingredient-slice';
import orderReducer from './order-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: BurgerConstructorSlice,
  currentIngredient: currentIngredientReducer,
  order: orderReducer,
});

export default rootReducer;


