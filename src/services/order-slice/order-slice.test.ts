import reducer, {
  clearOrder,
  placeOrder,
  getOrder,
  initialState,
} from './order-slice';
import {
  OrderResponse,
  FetchOrderResponse,
  ErrorResponse,
  OrderState,
} from '../../utils/types';

describe('orderSlice', () => {
  const orderResponse: OrderResponse = {
    order: {
      _id: '1',
      ingredients: ['ingredient1', 'ingredient2'],
      status: 'done',
      name: 'Order 1',
      createdAt: '2023-10-10T10:00:00.000Z',
      updatedAt: '2023-10-10T10:00:00.000Z',
      number: 1,
    },
    name: '',
    success: false,
  };

  const fetchOrderResponse: FetchOrderResponse = {
    orders: [orderResponse.order],
    success: false,
  };

  const errorResponse: ErrorResponse = {
    message: 'Ошибка',
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('async actions', () => {
    it('должен установить статус "loading" при placeOrder.pending', () => {
      const action = { type: placeOrder.pending.type };
      const expectedState = {
        ...initialState,
        status: 'loading',
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('должен установить заказ при placeOrder.fulfilled', () => {
      const action = {
        type: placeOrder.fulfilled.type,
        payload: orderResponse,
      };
      const expectedState = {
        ...initialState,
        order: orderResponse.order,
        status: 'succeeded',
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('должен установить ошибку при placeOrder.rejected', () => {
      const action = {
        type: placeOrder.rejected.type,
        payload: errorResponse,
      };
      const expectedState = {
        ...initialState,
        status: 'failed',
        error: errorResponse.message,
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('должен установить статус "loading" при getOrder.pending', () => {
      const action = { type: getOrder.pending.type };
      const expectedState = {
        ...initialState,
        status: 'loading',
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('должен установить заказ при getOrder.fulfilled', () => {
      const action = {
        type: getOrder.fulfilled.type,
        payload: fetchOrderResponse,
      };
      const expectedState = {
        ...initialState,
        order: fetchOrderResponse.orders[0],
        status: 'succeeded',
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });

    it('должен установить ошибку при getOrder.rejected', () => {
      const action = {
        type: getOrder.rejected.type,
        payload: errorResponse,
      };
      const expectedState = {
        ...initialState,
        status: 'failed',
        error: errorResponse.message,
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });
});
