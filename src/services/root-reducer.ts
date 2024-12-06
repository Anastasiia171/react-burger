import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients-slice';
import burgerConstructorReducer from './burger-constructor-slice';
import currentIngredientReducer from './current-ingredient-slice';
import orderReducer from './order-slice';
import authReducer from './auth-slice';
import feedOrdersReducer from './feed-orders-slice'; 
import historyOrdersReducer from './history-orders-slice'; 

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
