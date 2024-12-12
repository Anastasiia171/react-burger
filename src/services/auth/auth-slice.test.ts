import { User } from '../../utils/types';
import authReducer, {
  clearAuthState,
  setPasswordResetRequested,
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUser,
  updateUser,
  AuthState,
  initialState,
} from './auth-slice';

describe('authSlice', () => {
  it('должен вернуть начальное состояние', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен очистить состояние при clearAuthState', () => {
    const previousState: AuthState = {
      ...initialState,
      user: { name: 'Test', email: 'test@example.com' },
      token: 'sample-token',
    };
    expect(authReducer(previousState, clearAuthState())).toEqual(initialState);
  });

  it('должен установить passwordResetRequested при setPasswordResetRequested', () => {
    const action = setPasswordResetRequested(true);
    const expectedState: AuthState = {
      ...initialState,
      passwordResetRequested: true,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить статус на "loading" при registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const expectedState: AuthState = {
      ...initialState,
      status: 'loading',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить пользователя и токен при registerUser.fulfilled', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    const action = {
      type: registerUser.fulfilled.type,
      payload: { user, accessToken: 'new-token' },
    };
    const expectedState: AuthState = {
      ...initialState,
      status: 'succeeded',
      user,
      token: 'new-token',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить ошибку при registerUser.rejected', () => {
    const action = {
      type: registerUser.rejected.type,
      payload: { message: 'Ошибка при регистрации' },
    };
    const expectedState: AuthState = {
      ...initialState,
      status: 'failed',
      error: 'Ошибка при регистрации',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить статус на "loading" при loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const expectedState: AuthState = {
      ...initialState,
      status: 'loading',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить пользователя и токен при loginUser.fulfilled', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    const action = {
      type: loginUser.fulfilled.type,
      payload: { user, accessToken: 'new-token' },
    };
    const expectedState: AuthState = {
      ...initialState,
      status: 'succeeded',
      user,
      token: 'new-token',
      isAuthenticated: true,
      isUserLoading: false,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить ошибку при loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      payload: { message: 'Ошибка при авторизации' },
    };
    const expectedState: AuthState = {
      ...initialState,
      status: 'failed',
      error: 'Ошибка при авторизации',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен обновить токен при refreshToken.fulfilled', () => {
    const action = {
      type: refreshToken.fulfilled.type,
      payload: { accessToken: 'new-token' },
    };
    const expectedState: AuthState = {
      ...initialState,
      token: 'new-token',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить ошибку при refreshToken.rejected', () => {
    const action = {
      type: refreshToken.rejected.type,
      payload: { message: 'Ошибка при обновлении токена' },
    };
    const expectedState: AuthState = {
      ...initialState,
      status: 'failed',
      error: 'Ошибка при обновлении токена',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить статус на "loading" при logoutUser.pending', () => {
    const action = { type: logoutUser.pending.type };
    const expectedState: AuthState = {
      ...initialState,
      status: 'loading',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен очистить пользователя и токен при logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const expectedState: AuthState = {
      ...initialState,
      status: 'idle',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить ошибку при logoutUser.rejected', () => {
    const action = {
      type: logoutUser.rejected.type,
      payload: { message: 'Ошибка при выходе из системы' },
    };
    const expectedState: AuthState = {
      ...initialState,
      status: 'failed',
      error: 'Ошибка при выходе из системы',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить статус на "loading" при getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const expectedState: AuthState = {
      ...initialState,
      isUserLoading: true,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить пользователя при getUser.fulfilled', () => {
    const user = { name: 'Test', email: 'test@example.com' };
    const action = {
      type: getUser.fulfilled.type,
      payload: user,
    };
    const expectedState: AuthState = {
      ...initialState,
      user,
      isAuthenticated: true,
      isUserLoading: false,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить ошибку при getUser.rejected', () => {
    const action = { type: getUser.rejected.type };
    const expectedState: AuthState = {
      ...initialState,
      isAuthenticated: false,
      isUserLoading: false,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен обновить пользователя при updateUser.fulfilled', () => {
    const user = { name: 'Updated', email: 'updated@example.com' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: user,
    };
    const expectedState: AuthState = {
      ...initialState,
      user,
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  it('должен установить ошибку при updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      payload: 'Ошибка при обновлении данных пользователя',
    };
    const expectedState: AuthState = {
      ...initialState,
      error: 'Ошибка при обновлении данных пользователя',
    };
    expect(authReducer(initialState, action)).toEqual(expectedState);
  });
});
