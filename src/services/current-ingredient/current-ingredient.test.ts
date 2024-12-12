import reducer, {
  setCurrentIngredient,
  clearCurrentIngredient,
  initialState,
} from './current-ingredient-slice';
import { CurrentIngredientState, Ingredient } from '../../utils/types';

describe('currentIngredientSlice', () => {
  const ingredient: Ingredient = {
    _id: '1',
    name: 'Lettuce',
    type: 'main',
    proteins: 1,
    fat: 0,
    carbohydrates: 2,
    calories: 5,
    price: 1,
    image: 'lettuce.png',
    image_mobile: 'lettuce-mobile.png',
    image_large: 'lettuce-large.png',
    __v: 0,
    quantity: 1,
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен установить текущий ингредиент', () => {
    const action = setCurrentIngredient(ingredient);
    const expectedState: CurrentIngredientState = {
      currentIngredient: ingredient,
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('должен очистить текущий ингредиен', () => {
    const action = clearCurrentIngredient();
    const preloadedState: CurrentIngredientState = {
      currentIngredient: ingredient,
    };
    const expectedState: CurrentIngredientState = {
      currentIngredient: null,
    };
    expect(reducer(preloadedState, action)).toEqual(expectedState);
  });
});
