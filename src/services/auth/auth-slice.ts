import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authRequest, request } from '../../utils/apiUtils';
import { UserResponse, UserData, ErrorResponse, User } from '../../utils/types';
import {
  REGISTER_URL,
  LOGIN_URL,
  TOKEN_URL,
  LOGOUT_URL,
  GET_USER,
} from '../../utils/constants';
import {
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '../../utils/auth-tokens';

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  passwordResetRequested: boolean;
  isAuthenticated: boolean;
  isUserLoading: boolean;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  passwordResetRequested: false,
  isAuthenticated: false,
  isUserLoading: true,
};

export const registerUser = createAsyncThunk<
  UserResponse,
  UserData,
  { rejectValue: ErrorResponse }
>('auth/registerUser', async (userData: UserData, { rejectWithValue }) => {
  try {
    const data = await request<UserResponse>(REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
      }),
    });

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    return data;
  } catch (error) {
    return rejectWithValue({ message: 'Ошибка при регистрации' });
  }
});

export const loginUser = createAsyncThunk<
  UserResponse,
  UserData,
  { rejectValue: ErrorResponse }
>('auth/loginUser', async (userData: UserData, { rejectWithValue }) => {
  try {
    const data = await request<UserResponse>(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    setAccessToken(data.accessToken);

    setRefreshToken(data.refreshToken);

    return data;
  } catch (error) {
    return rejectWithValue({ message: 'Ошибка при авторизации' });
  }
});

export const refreshToken = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: ErrorResponse }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    const data = await request<UserResponse>(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: refreshToken,
      }),
    });

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    return data;
  } catch (error) {
    return rejectWithValue({ message: 'Ошибка при обновлении токена' });
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: ErrorResponse }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return rejectWithValue({ message: 'Отсутствует refreshToken' });
    }

    const response = await request<{ success: boolean; message: string }>(
      LOGOUT_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      },
    );

    if (response.success) {
      removeAccessToken();
      removeRefreshToken();
    } else {
      return rejectWithValue({ message: response.message });
    }
  } catch (error) {
    return rejectWithValue({ message: 'Ошибка при выходе из системы' });
  }
});

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authRequest<{
        success: boolean;
        user: { name: string; email: string };
      }>(GET_USER, {
        method: 'GET',
      });
      return response.user;
    } catch (error) {
      return rejectWithValue('Ошибка при получении данных пользователя');
    }
  },
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authRequest<{ success: boolean; user: User }>(
        GET_USER,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        },
      );

      if (response.success) {
        return response.user;
      } else {
        return rejectWithValue('Не удалось обновить данные пользователя');
      }
    } catch (error) {
      return rejectWithValue(
        'Произошла ошибка при обновлении данных пользователя',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('refreshToken');
    },
    setPasswordResetRequested: (state, action: PayloadAction<boolean>) => {
      state.passwordResetRequested = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Ошибка при регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.token = action.payload.accessToken;
          state.isAuthenticated = true;
          state.isUserLoading = false;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Неизвестная ошибка';
      })
      .addCase(
        refreshToken.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.token = action.payload.accessToken;
        },
      )
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Не удалось обновить токен';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? 'Ошибка при выходе из системы';
      })
      .addCase(getUser.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<{ name: string; email: string }>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.isUserLoading = false;
        },
      )
      .addCase(getUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.isUserLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthState, setPasswordResetRequested } = authSlice.actions;
export default authSlice.reducer;
