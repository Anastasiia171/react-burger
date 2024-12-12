import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentIngredientState, Ingredient } from '../../utils/types';

export const initialState: CurrentIngredientState = {
  currentIngredient: null,
};

const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.currentIngredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.currentIngredient = null;
    },
  },
});

export const { setCurrentIngredient, clearCurrentIngredient } =
  currentIngredientSlice.actions;
export default currentIngredientSlice.reducer;
