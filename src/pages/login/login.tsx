import React from 'react';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './login.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../services/auth/auth-slice';
import { AppDispatch, RootState } from '../../services/store';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useAppSelector((state) => state.auth);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const redirectTo = location.state?.from?.pathname || '/react-burger';
      navigate(redirectTo);
    }
  };

  return (
    <div className={`${styles.wrapper} mt-30`}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <EmailInput
          onChange={onEmailChange}
          value={email}
          name={'email'}
          placeholder="E-mail"
        />
        <PasswordInput
          onChange={onPasswordChange}
          value={password}
          name={'password'}
        />
        {error && (
          <p className="text text_type_main-default text_color_error">
            {error}
          </p>
        )}
        <Button
          type="primary"
          htmlType={'submit'}
          disabled={status === 'loading'}
        >
          Войти
        </Button>
      </form>

      <div className={`${styles.bottomLinks} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link to="/react-burger/register">Зарегистрироваться</Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/react-burger/forgot-password">Восстановить пароль</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
