import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BurgerConstructorState, Ingredient } from '../../utils/types';
import { nanoid } from 'nanoid';

interface MoveIngredientPayload {
  dragIndex: number;
  hoverIndex: number;
}

export const initialState: BurgerConstructorState = {
  bun: null,
  burgerIngredients: [],
};

const BurgerConstructorSlice = createSlice({
  name: 'burger-constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<Ingredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.burgerIngredients.push(action.payload);
        }
      },
      prepare: (ingredient: Ingredient) => {
        if (ingredient.type === 'bun') {
          return { payload: ingredient };
        }
        return { payload: { ...ingredient, uniqueId: nanoid() } };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burgerIngredients = state.burgerIngredients.filter(
        (ingredient) => ingredient.uniqueId !== action.payload,
      );
    },
    moveIngredient: (state, action: PayloadAction<MoveIngredientPayload>) => {
      const { dragIndex, hoverIndex } = action.payload;
      if (
        dragIndex >= 0 &&
        hoverIndex >= 0 &&
        dragIndex < state.burgerIngredients.length &&
        hoverIndex < state.burgerIngredients.length
      ) {
        const draggedIngredient = state.burgerIngredients[dragIndex];
        state.burgerIngredients.splice(dragIndex, 1);
        state.burgerIngredients.splice(hoverIndex, 0, draggedIngredient);
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.burgerIngredients = [];
    },
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} = BurgerConstructorSlice.actions;
export default BurgerConstructorSlice.reducer;
