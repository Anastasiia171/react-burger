import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState,
} from './burger-constructor-slice';
import { BurgerConstructorState, Ingredient } from '../../utils/types';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

const { nanoid } = require('nanoid');

nanoid.mockReturnValue('mocked-id');

const bun: Ingredient = {
  _id: '1',
  name: 'Bun',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 150,
  price: 2,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png',
  __v: 0,
  quantity: 1,
};

const baseIngredient: Ingredient = {
  _id: '2',
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

describe('BurgerConstructorSlice', () => {
  beforeEach(() => {
    nanoid.mockReturnValue('unique-id');
  });

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен добавить булочку', () => {
    const action = addIngredient(bun);
    const expectedState = { ...initialState, bun };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('должен добавить ингредиент с уникальным ID', () => {
    const action = addIngredient(baseIngredient);
    const expectedState = {
      ...initialState,
      burgerIngredients: [{ ...baseIngredient, uniqueId: 'unique-id' }],
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('должен удалить ингредиент по uniqueId', () => {
    const ingredient = { ...baseIngredient, uniqueId: 'unique-id' };
    const stateWithIngredient: BurgerConstructorState = {
      ...initialState,
      burgerIngredients: [ingredient],
    };
    const action = removeIngredient('unique-id');
    const expectedState = { ...initialState, burgerIngredients: [] };
    expect(reducer(stateWithIngredient, action)).toEqual(expectedState);
  });

  it('должен переместить ингредиент', () => {
    const ingredient1 = { ...baseIngredient, uniqueId: 'id-1' };
    const ingredient2 = {
      ...baseIngredient,
      _id: '3',
      name: 'Tomato',
      uniqueId: 'id-2',
    };
    const stateWithIngredients: BurgerConstructorState = {
      ...initialState,
      burgerIngredients: [ingredient1, ingredient2],
    };
    const action = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
    const expectedState = {
      ...initialState,
      burgerIngredients: [ingredient2, ingredient1],
    };
    expect(reducer(stateWithIngredients, action)).toEqual(expectedState);
  });

  it('должен очистить конструктор', () => {
    const stateWithIngredients: BurgerConstructorState = {
      bun,
      burgerIngredients: [{ ...baseIngredient, uniqueId: 'id-1' }],
    };
    const action = clearConstructor();
    expect(reducer(stateWithIngredients, action)).toEqual(initialState);
  });
});
