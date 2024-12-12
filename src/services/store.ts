import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root-reducer';
import { wsMiddlewareWrapper } from './wsMiddleware';
import { setOrders as setOrdersFull } from './feed-orders/feed-orders-slice';
import { WS_ORDERS_URL, WS_USER_ORDERS_URL } from '../utils/constants';

import { setOrders as setOrdersUser } from './history-orders/history-orders-slice';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      wsMiddlewareWrapper({
        setData: setOrdersFull,
        SOCKET_URL: WS_ORDERS_URL,
        connectActionType: 'orders/connect',
        disconnectActionType: 'orders/disconnect',
      }),
      wsMiddlewareWrapper({
        setData: setOrdersUser,
        SOCKET_URL: WS_USER_ORDERS_URL,
        connectActionType: 'orderHistory/connect',
        disconnectActionType: 'orderHistory/disconnect',
      }),
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export default store;
