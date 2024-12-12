import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients-slice/ingredients-slice';
import burgerConstructorReducer from './burger-constructor/burger-constructor-slice';
import currentIngredientReducer from './current-ingredient/current-ingredient-slice';
import orderReducer from './order-slice/order-slice';
import authReducer from './auth/auth-slice';
import feedOrdersReducer from './feed-orders/feed-orders-slice';
import historyOrdersReducer from './history-orders/history-orders-slice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  currentIngredient: currentIngredientReducer,
  order: orderReducer,
  auth: authReducer,
  feedOrders: feedOrdersReducer,
  historyOrders: historyOrdersReducer,
});

export default rootReducer;
