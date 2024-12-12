import React from 'react';
import {
  Button,
  EmailInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './forgot-password.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FORGOT_PASSWORD } from '../../utils/constants';
import { request } from '../../utils/apiUtils';
import { setPasswordResetRequested } from '../../services/auth/auth-slice';
import { useAppDispatch } from '../../services/hooks';

const FotgotPasswordPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleRecoverClick = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await request<{ success: boolean; message: string }>(
        FORGOT_PASSWORD,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      if (result.success) {
        dispatch(setPasswordResetRequested(true));
        navigate('/react-burger/reset-password');
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
      <EmailInput
        onChange={onEmailChange}
        value={email}
        name={'email'}
        placeholder="Укажите E-mail"
      />
      {error && (
        <p className="text text_type_main-default text_color_error">{error}</p>
      )}
      <Button
        type="primary"
        htmlType={'button'}
        onClick={handleRecoverClick}
        disabled={isLoading}
      >
        {isLoading ? 'Отправка...' : 'Восстановить'}
      </Button>

      <div className={`${styles.bottomLinks} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль? <Link to="/react-burger/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default FotgotPasswordPage;
