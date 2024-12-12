import { Middleware } from '@reduxjs/toolkit';
import { SetOrdersFull } from './feed-orders/feed-orders-slice';
import { SetOrdersPersonal } from './history-orders/history-orders-slice';
import { getAccessToken } from '../utils/auth-tokens';

interface Props {
  setData: SetOrdersFull | SetOrdersPersonal;
  SOCKET_URL: string;
  connectActionType: string;
  disconnectActionType: string;
}

export function wsMiddlewareWrapper({
  setData,
  SOCKET_URL,
  connectActionType,
  disconnectActionType,
}: Props): Middleware {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action: any) => {
      if (action.type === connectActionType) {
        if (!socket || socket.readyState === WebSocket.CLOSED) {
          const token = getAccessToken();
          const urlWithToken = `${SOCKET_URL}?token=${token}`;
          console.log('Connecting to WebSocket...');

          socket = new WebSocket(urlWithToken);

          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received data:', data);
            if (data.success) {
              store.dispatch(setData(data));
            }
          };

          socket.onopen = () => {
            console.log('WebSocket connection established');
          };

          socket.onclose = () => {
            console.log('WebSocket connection closed', SOCKET_URL);
          };

          socket.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
        }
      }

      if (action.type === disconnectActionType) {
        if (socket) {
          console.log('Disconnecting from WebSocket...');
          socket.close();
          socket = null;
        }
      }

      return next(action);
    };
  };
}
