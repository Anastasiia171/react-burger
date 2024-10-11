import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorResponse, OrderResponse, OrderState } from '../utils/types';
import { ORDER_URL } from '../utils/constants';
import { request } from '../utils/apiUtils';

export const placeOrder = createAsyncThunk<OrderResponse, string[], { rejectValue: ErrorResponse }>(
  'order/placeOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
        const data = await request<OrderResponse>(ORDER_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients: ingredientIds }),
          });
          return data;
    } catch (error) {
      return rejectWithValue({ message: 'Ошибка сети' });
    }
  }
);

const initialState: OrderState = {
  order: null,
  status: 'idle',
  error: null,
};


const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.order = action.payload.order;
        state.status = 'succeeded';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Неизвестная ошибка';
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
