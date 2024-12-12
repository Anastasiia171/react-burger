import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../utils/types';

export interface FeedOrdersState {
  orders: Order[];
  total: number;
  totalToday: number;
}

export const initialState: FeedOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
};

const FeedOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<FeedOrdersState>) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    connect() {},
    disconnect() {},
  },
});

export const { setOrders, connect, disconnect } = FeedOrdersSlice.actions;

export type SetOrdersFull = typeof setOrders;

export default FeedOrdersSlice.reducer;
