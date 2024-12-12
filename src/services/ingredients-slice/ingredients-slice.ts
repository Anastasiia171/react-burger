import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Ingredient, IngredientsState } from '../../utils/types';
import { API_URL } from '../../utils/constants';
import { request } from '../../utils/apiUtils';

export const initialState: IngredientsState = {
  ingredients: [],
  status: 'idle',
  error: null,
  currentIngredient: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await request<{ data: Ingredient[] }>(API_URL, {});
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      state.ingredients = action.payload;
    },
    setCurrentIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.currentIngredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    },
    incrementIngredientCount: (state, action: PayloadAction<string>) => {
      const ingredient = state.ingredients.find(
        (i) => i._id === action.payload,
      );
      if (ingredient) {
        ingredient.__v += 1;
      }
    },
    decrementIngredientCount: (state, action: PayloadAction<string>) => {
      const ingredient = state.ingredients.find(
        (i) => i._id === action.payload,
      );
      if (ingredient && ingredient.__v > 0) {
        ingredient.__v -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<Ingredient[]>) => {
          state.status = 'succeeded';
          state.ingredients = action.payload;
        },
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setIngredients,
  setCurrentIngredient,
  clearCurrentIngredient,
  incrementIngredientCount,
  decrementIngredientCount,
} = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
