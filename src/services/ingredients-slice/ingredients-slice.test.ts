import reducer, {
  setIngredients,
  setCurrentIngredient,
  clearCurrentIngredient,
  incrementIngredientCount,
  decrementIngredientCount,
  fetchIngredients,
  initialState,
} from './ingredients-slice';
import { Ingredient, IngredientsState } from '../../utils/types';

describe('ingredientsSlice', () => {
  const ingredient: Ingredient = {
    _id: '1',
    name: 'Test Ingredient',
    type: 'sauce',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'image_url',
    image_mobile: 'image_mobile_url',
    image_large: 'image_large_url',
    __v: 0,
    quantity: 0,
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен установить ингредиенты', () => {
    const action = setIngredients([ingredient]);
    const expectedState = {
      ...initialState,
      ingredients: [ingredient],
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить текущий ингредиент', () => {
    const action = setCurrentIngredient(ingredient);
    const expectedState = {
      ...initialState,
      currentIngredient: ingredient,
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('должен очистить текущий ингредиент', () => {
    const stateWithCurrent = {
      ...initialState,
      currentIngredient: ingredient,
    };
    const action = clearCurrentIngredient();
    expect(reducer(stateWithCurrent, action)).toEqual(initialState);
  });

  it('должен увеличить счетчик ингредиента', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [ingredient],
    };
    const action = incrementIngredientCount('1');
    const expectedState = {
      ...stateWithIngredient,
      ingredients: [{ ...ingredient, __v: 1 }],
    };
    expect(reducer(stateWithIngredient, action)).toEqual(expectedState);
  });

  it('должен уменьшить счетчик ингредиента', () => {
    const ingredientWithCount = { ...ingredient, __v: 1 };
    const stateWithIngredient = {
      ...initialState,
      ingredients: [ingredientWithCount],
    };
    const action = decrementIngredientCount('1');
    const expectedState = {
      ...stateWithIngredient,
      ingredients: [{ ...ingredient, __v: 0 }],
    };
    expect(reducer(stateWithIngredient, action)).toEqual(expectedState);
  });

  describe('async actions', () => {
    it('должен установить статус "loading" при fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const expectedState = {
        ...initialState,
        status: 'loading',
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('должен установить ингредиенты при fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: [ingredient],
      };
      const expectedState = {
        ...initialState,
        status: 'succeeded',
        ingredients: [ingredient],
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('должен установить ошибку при fetchIngredients.rejected', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: 'Error message',
      };
      const expectedState = {
        ...initialState,
        status: 'failed',
        error: 'Error message',
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });
});
