import reducer, {
  setOrders,
  connect,
  disconnect,
  FeedOrdersState,
  initialState,
} from './feed-orders-slice';
import { Order } from '../../utils/types';

describe('FeedOrdersSlice', () => {
  const orders: Order[] = [
    {
      _id: '1',
      ingredients: ['ingredient1', 'ingredient2'],
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-10-10T10:00:00.000Z',
      updatedAt: '2023-10-10T10:00:00.000Z',
      number: 1,
    },
  ];

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен установить заказы', () => {
    const action = setOrders({
      orders,
      total: 100,
      totalToday: 10,
    });
    const expectedState: FeedOrdersState = {
      orders,
      total: 100,
      totalToday: 10,
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('должен не изменять состояние при connect', () => {
    const action = connect();
    expect(reducer(initialState, action)).toEqual(initialState);
  });

  it('должен не изменять состояние при disconnect', () => {
    const action = disconnect();
    expect(reducer(initialState, action)).toEqual(initialState);
  });
});