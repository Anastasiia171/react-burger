import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ErrorResponse,
  FetchOrderResponse,
  OrderResponse,
  OrderState,
} from '../../utils/types';
import { ORDER_URL } from '../../utils/constants';
import { authRequest } from '../../utils/apiUtils';

export const placeOrder = createAsyncThunk<
  OrderResponse,
  string[],
  { rejectValue: ErrorResponse }
>('order/placeOrder', async (ingredientIds, { rejectWithValue }) => {
  const data = await authRequest<OrderResponse>(ORDER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });
  return data;
});

export const getOrder = createAsyncThunk<
  FetchOrderResponse,
  string,
  { rejectValue: ErrorResponse }
>('order/getOrder', async (orderId, { rejectWithValue }) => {
  const data = await authRequest<FetchOrderResponse>(
    `${ORDER_URL}/${orderId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return data;
});

export const initialState: OrderState = {
  order: null,
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        placeOrder.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.order = action.payload.order;
          state.status = 'succeeded';
        },
      )
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Неизвестная ошибка';
      })
      .addCase(getOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        getOrder.fulfilled,
        (state, action: PayloadAction<FetchOrderResponse>) => {
          state.order = action.payload.orders[0];
          state.status = 'succeeded';
        },
      )
      .addCase(getOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Неизвестная ошибка';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
