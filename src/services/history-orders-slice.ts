import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../utils/types';

interface HistoryOrdersState {
  orders: Order[];
}

const initialState: HistoryOrdersState = {
  orders: [],
};

const HistoryOrdersSlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<HistoryOrdersState>) {
      state.orders = action.payload.orders;
    },
    connect() {},
  },
});

export const { setOrders, connect } = HistoryOrdersSlice.actions;

export type SetOrdersPersonal = typeof setOrders;

export default HistoryOrdersSlice.reducer;