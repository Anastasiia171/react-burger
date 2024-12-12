import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../utils/types';

export interface HistoryOrdersState {
  orders: Order[];
}

export const initialState: HistoryOrdersState = {
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
    disconnect() {},
  },
});

export const { setOrders, connect, disconnect } = HistoryOrdersSlice.actions;

export type SetOrdersPersonal = typeof setOrders;

export default HistoryOrdersSlice.reducer;
