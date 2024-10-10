import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorResponse, OrderResponse, OrderState } from '../utils/types';
import { ORDER_URL } from '../utils/constants';

export const placeOrder = createAsyncThunk<OrderResponse, string[], { rejectValue: ErrorResponse }>(
  'order/placeOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await fetch(ORDER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: ingredientIds }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        return rejectWithValue(errorData);
      }

      const data: OrderResponse = await response.json();
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
