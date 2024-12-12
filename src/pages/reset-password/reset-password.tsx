import React from 'react';
import {
  Button,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './reset-password.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { RESET_PASSWORD } from '../../utils/constants';
import { request } from '../../utils/apiUtils';
import { useAppDispatch } from '../../services/hooks';
import { setPasswordResetRequested } from '../../services/auth/auth-slice';

const ResetPasswordPage: React.FC = () => {
  const [code, setCode] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await request<{ success: boolean; message: string }>(
        RESET_PASSWORD,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: password,
            token: code,
          }),
        },
      );

      if (result.success) {
        dispatch(setPasswordResetRequested(false));
        navigate('/react-burger/login');
      } else {
        setError(result.message || 'Что-то пошло не так. Попробуйте еще раз.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при отправке запроса.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.wrapper} mt-30`}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <PasswordInput
        onChange={onPasswordChange}
        value={password}
        name={'password'}
        placeholder="Введите новый пароль"
      />
      <Input
        type="text"
        placeholder="Введите код из письма"
        onChange={onCodeChange}
        value={code}
        name={'code'}
        size={'default'}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
      {error && (
        <p className="text text_type_main-default text_color_error">{error}</p>
      )}
      <Button
        type="primary"
        htmlType={'button'}
        onClick={handleSaveClick}
        disabled={isLoading}
      >
        {isLoading ? 'Сохранение...' : 'Сохранить'}
      </Button>

      <div className={`${styles.bottomLinks} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль? <Link to="/react-burger/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
