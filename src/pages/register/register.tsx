import React from 'react';
import {
  Button,
  Input,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '../../services/hooks';

import { useNavigate, useLocation } from 'react-router-dom';
import styles from './register.module.css';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../services/store';
import { registerUser } from '../../services/auth/auth-slice';

const RegisterPage: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useAppSelector((state) => state.auth);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ email, password, name }));
    if (registerUser.fulfilled.match(result)) {
      const redirectTo = location.state?.from?.pathname || '/react-burger';
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className={`${styles.wrapper} mt-30`}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="Имя"
          onChange={onNameChange}
          value={name}
          name={'name'}
          size={'default'}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
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
          Зарегистрироваться
        </Button>
      </form>

      <div className={`${styles.bottomLinks} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы? <Link to="/react-burger/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
